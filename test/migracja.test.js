/**
 * Migracja ze starego ranking-data.json do SQLite oraz trwałość danych,
 * które wcześniej żyły w pamięci (kody, bilety, liczniki limitów).
 *
 * Restart serwera symulujemy przeładowaniem modułu: czyścimy cache require
 * i wczytujemy go ponownie ze zmienionymi zmiennymi środowiskowymi. Moduł czyta
 * konfigurację przy wczytaniu, więc daje to świeżą instancję na tej samej bazie.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SCIEZKA_MODULU = require.resolve("../ranking-server.js");
const sprzatanie = [];

function wczytajSerwer({ dbFile, dataFile }) {
  delete require.cache[SCIEZKA_MODULU];
  process.env.DB_FILE = dbFile;
  process.env.DATA_FILE = dataFile;
  process.env.CHALLENGE_SALT = "sol-testowa";
  process.env.GAME_URL = "http://localhost:9999/gra.html";
  delete process.env.SMTP_HOST;
  return require("../ranking-server.js");
}

function nowyKomplet(nazwa) {
  const db = path.join(os.tmpdir(), `migr-${process.pid}-${nazwa}.db`);
  const json = path.join(os.tmpdir(), `migr-${process.pid}-${nazwa}.json`);
  sprzatanie.push(db, db + "-wal", db + "-shm", json, json + ".migrated");
  return { db, json };
}

test.after(() => { for (const f of sprzatanie) try { fs.unlinkSync(f); } catch (_) {} });

const STARE_DANE = {
  scores: [
    { email: "a@example.com", nick: "Alfa", score: 80, scenario: "FENIKS", date: "2026-01-01T00:00:00.000Z" },
    { email: "b@example.com", nick: "Beta", score: 60, scenario: "FENIKS", date: "2026-01-02T00:00:00.000Z" },
  ],
  challenges: [{
    id: "a".repeat(32), challengerEmail: "a@example.com", challengerNick: "Alfa",
    score: 80, scenario: "FENIKS", created: "2026-01-03T00:00:00.000Z",
    expires: 4102444800000, answer: null,
  }],
};

test("migracja przenosi wyniki i pojedynki ze starego pliku JSON", () => {
  const { db, json } = nowyKomplet("podstawowa");
  fs.writeFileSync(json, JSON.stringify(STARE_DANE));
  const srv = wczytajSerwer({ dbFile: db, dataFile: json });

  const wyniki = srv.sql.prepare("SELECT email, nick, score FROM scores ORDER BY score DESC").all();
  assert.deepStrictEqual(wyniki.map(w => w.nick), ["Alfa", "Beta"]);
  assert.strictEqual(wyniki[0].score, 80);

  const c = srv.findChallenge("a".repeat(32));
  assert.ok(c, "pojedynek powinien być przeniesiony");
  assert.strictEqual(c.challengerNick, "Alfa");
  assert.strictEqual(c.answer, null);
  assert.strictEqual(srv.challengeStatus(c, 1_700_000_000_000), "open");
});

test("oryginalny plik jest zachowany pod zmienioną nazwą, nie kasowany", () => {
  const { db, json } = nowyKomplet("zachowanie");
  fs.writeFileSync(json, JSON.stringify(STARE_DANE));
  wczytajSerwer({ dbFile: db, dataFile: json });

  assert.strictEqual(fs.existsSync(json), false, "stary plik nie powinien już leżeć pod pierwotną nazwą");
  assert.strictEqual(fs.existsSync(json + ".migrated"), true, "oryginał musi zostać na dysku");
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(json + ".migrated", "utf-8")), STARE_DANE);
});

test("ponowny start nie duplikuje danych", () => {
  const { db, json } = nowyKomplet("bezduplikatow");
  fs.writeFileSync(json, JSON.stringify(STARE_DANE));
  wczytajSerwer({ dbFile: db, dataFile: json });
  const srv2 = wczytajSerwer({ dbFile: db, dataFile: json });   // „restart"

  assert.strictEqual(srv2.sql.prepare("SELECT COUNT(*) n FROM scores").get().n, 2);
  assert.strictEqual(srv2.sql.prepare("SELECT COUNT(*) n FROM challenges").get().n, 1);
});

test("brak starego pliku to nie błąd — czysta baza wstaje pusta", () => {
  const { db, json } = nowyKomplet("czysta");
  const srv = wczytajSerwer({ dbFile: db, dataFile: json });
  assert.strictEqual(srv.sql.prepare("SELECT COUNT(*) n FROM scores").get().n, 0);
});

test("uszkodzony stary plik nie wywraca startu serwera", () => {
  const { db, json } = nowyKomplet("uszkodzony");
  fs.writeFileSync(json, "{to nie jest poprawny JSON");
  const srv = wczytajSerwer({ dbFile: db, dataFile: json });
  assert.strictEqual(srv.sql.prepare("SELECT COUNT(*) n FROM scores").get().n, 0);
  assert.strictEqual(fs.existsSync(json), true, "uszkodzonego pliku nie ruszamy — zostaje do wglądu");
});

// ---------- trwałość tego, co kiedyś żyło w pamięci ----------

test("kod autoryzacyjny przeżywa restart serwera", () => {
  const { db, json } = nowyKomplet("kody");
  const srv1 = wczytajSerwer({ dbFile: db, dataFile: json });
  srv1.codes.set("ktos@example.com", { code: "123456", expires: 4102444800000, attempts: 0 });

  const srv2 = wczytajSerwer({ dbFile: db, dataFile: json });
  const wpis = srv2.codes.get("ktos@example.com");
  assert.strictEqual(wpis.code, "123456");
  assert.strictEqual(wpis.attempts, 0);
});

test("licznik limitu wysyłek przeżywa restart — ochrona przed spamem nie resetuje się", () => {
  const { db, json } = nowyKomplet("limity");
  const srv1 = wczytajSerwer({ dbFile: db, dataFile: json });
  const teraz = 1_700_000_000_000;
  for (let i = 0; i < srv1.CHALLENGE_LIMIT.perTarget; i++)
    srv1.recordHit(srv1.targetLog, "skrot-ofiary", teraz);

  const srv2 = wczytajSerwer({ dbFile: db, dataFile: json });
  assert.strictEqual(
    srv2.limitExceeded(srv2.targetLog, "skrot-ofiary",
      srv2.CHALLENGE_LIMIT.perTarget, srv2.CHALLENGE_LIMIT.windowMs, teraz + 1000),
    true, "po restarcie limit ma nadal obowiązywać");
});

test("bilet na wyzwanie przeżywa restart i pozostaje jednorazowy", () => {
  const { db, json } = nowyKomplet("bilety");
  const srv1 = wczytajSerwer({ dbFile: db, dataFile: json });
  const t = srv1.issueTicket("kto@example.com", "FENIKS", 1_700_000_000_000);

  const srv2 = wczytajSerwer({ dbFile: db, dataFile: json });
  const uzyty = srv2.consumeTicket(t, 1_700_000_000_000 + 1000);
  assert.strictEqual(uzyty.email, "kto@example.com");
  assert.strictEqual(srv2.consumeTicket(t, 1_700_000_000_000 + 1000), null, "drugie użycie musi zawieść");
});

test("stare wpisy limitów wypadają z okna po jego upływie", () => {
  const { db, json } = nowyKomplet("okno");
  const srv = wczytajSerwer({ dbFile: db, dataFile: json });
  const t0 = 1_700_000_000_000;
  for (let i = 0; i < srv.CHALLENGE_LIMIT.perTarget; i++) srv.recordHit(srv.targetLog, "k", t0);
  assert.strictEqual(srv.limitExceeded(srv.targetLog, "k", srv.CHALLENGE_LIMIT.perTarget,
    srv.CHALLENGE_LIMIT.windowMs, t0 + srv.CHALLENGE_LIMIT.windowMs + 1), false);
});
