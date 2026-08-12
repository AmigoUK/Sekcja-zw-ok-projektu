/**
 * Testy pojedynków — node:test, zero zależności zewnętrznych.
 * Uruchomienie: npm test
 *
 * DATA_FILE wskazuje na plik tymczasowy, żeby testy nie dotykały prawdziwego rankingu.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const TMP_DB = path.join(os.tmpdir(), `ranking-test-${process.pid}.db`);
process.env.DB_FILE = TMP_DB;
process.env.DATA_FILE = path.join(os.tmpdir(), `nieistniejacy-${process.pid}.json`);
process.env.GAME_URL = "http://localhost:9999/sekcja-zwlok.html";
process.env.CHALLENGE_SALT = "sol-testowa";
delete process.env.SMTP_HOST;                 // tryb DEV: maile lecą na konsolę

const srv = require("../ranking-server.js");

test.after(() => {
  for (const f of [TMP_DB, TMP_DB + "-wal", TMP_DB + "-shm"])
    try { fs.unlinkSync(f); } catch (_) {}
});

// ---------- serwer HTTP na efemerycznym porcie ----------
let base;
const server = srv.app.listen(0);
test.before(() => new Promise(r => {
  if (server.listening) { base = `http://localhost:${server.address().port}`; return r(); }
  server.once("listening", () => { base = `http://localhost:${server.address().port}`; r(); });
}));
test.after(() => server.close());

const post = (p, body) => fetch(base + p, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
}).then(async r => ({ status: r.status, body: await r.json() }));
const get = p => fetch(base + p).then(async r => ({ status: r.status, body: await r.json() }));

// Kod autoryzacyjny czytamy z konsoli — w trybie DEV to jedyne miejsce, gdzie się pojawia.
function captureLog(fn) {
  const orig = console.log;
  let out = "";
  console.log = (...a) => { out += a.join(" ") + "\n"; };
  return Promise.resolve(fn()).finally(() => { console.log = orig; }).then(() => out);
}

// ---------- funkcje czyste ----------
test("hashTarget: ten sam adres daje ten sam skrót, wielkość liter bez znaczenia", () => {
  assert.strictEqual(srv.hashTarget("Ktos@Example.COM"), srv.hashTarget("ktos@example.com"));
  assert.notStrictEqual(srv.hashTarget("a@b.pl"), srv.hashTarget("c@d.pl"));
});

test("hashTarget: skrót nie zawiera adresu w czytelnej postaci", () => {
  const h = srv.hashTarget("ofiara@example.com");
  assert.ok(!h.includes("ofiara"), "skrót nie może ujawniać adresu");
  assert.match(h, /^[0-9a-f]{64}$/);
});

test("limitExceeded: przesuwane okno przepuszcza po wygaśnięciu wpisów", () => {
  const log = new Map();
  const t0 = 1_000_000;
  const win = 60_000;
  for (let i = 0; i < 3; i++) {
    assert.strictEqual(srv.limitExceeded(log, "k", 3, win, t0), false, `wpis ${i} powinien przejść`);
    srv.recordHit(log, "k", t0);
  }
  assert.strictEqual(srv.limitExceeded(log, "k", 3, win, t0), true, "czwarty przekracza limit");
  assert.strictEqual(srv.limitExceeded(log, "k", 3, win, t0 + win + 1), false, "po oknie znowu wolno");
});

test("limitExceeded: sprawdzenie nie zużywa limitu", () => {
  const log = new Map();
  for (let i = 0; i < 10; i++) assert.strictEqual(srv.limitExceeded(log, "k", 1, 60_000, 1000), false);
});

test("bilet jest jednorazowy i wygasa", () => {
  const t = srv.issueTicket("a@b.pl", "FENIKS", 1000);
  assert.strictEqual(srv.consumeTicket(t, 1000).email, "a@b.pl");
  assert.strictEqual(srv.consumeTicket(t, 1000), null, "drugie użycie musi zawieść");

  const t2 = srv.issueTicket("a@b.pl", "FENIKS", 1000);
  assert.strictEqual(srv.consumeTicket(t2, 1000 + srv.TICKET_TTL_MS + 1), null, "po TTL bilet martwy");
});

test("challengeStatus rozróżnia open / answered / expired", () => {
  const now = 1_000_000;
  assert.strictEqual(srv.challengeStatus({ expires: now + 1, answer: null }, now), "open");
  assert.strictEqual(srv.challengeStatus({ expires: now - 1, answer: null }, now), "expired");
  assert.strictEqual(srv.challengeStatus({ expires: now - 1, answer: { score: 1 } }, now), "answered",
    "odpowiedź ma pierwszeństwo przed wygaśnięciem");
});

// ---------- endpointy ----------
test("pełny pojedynek: wyzwanie, odczyt, odpowiedź, rozstrzygnięcie", async () => {
  const out = await captureLog(() => post("/api/request-code", { email: "wyzywajacy@example.com", nick: "Prokurator" }));
  const code = out.match(/rankingu:\s*(\d{6})/)[1];

  const saved = await post("/api/submit-score",
    { email: "wyzywajacy@example.com", nick: "Prokurator", code, score: 86, scenario: "FENIKS" });
  assert.strictEqual(saved.status, 200);
  assert.ok(saved.body.challengeTicket, "submit-score musi zwrócić bilet");

  const mail = await captureLog(() => post("/api/challenge",
    { ticket: saved.body.challengeTicket, targetName: "Anna", targetEmail: "anna@example.com" }));
  assert.match(mail, /Prokurator wyzywa Cię/, "mail zawiera nick z bazy");
  assert.match(mail, /86\/100/, "mail zawiera wynik do pobicia");
  assert.match(mail, /nie zapisali/i, "mail informuje o braku retencji adresu");

  const id = mail.match(/[?&]w=([0-9a-f]{32})/)[1];

  const view = await get(`/api/challenge/${id}`);
  assert.strictEqual(view.status, 200);
  assert.deepStrictEqual(
    { nick: view.body.nick, score: view.body.score, status: view.body.status },
    { nick: "Prokurator", score: 86, status: "open" });
  assert.ok(!JSON.stringify(view.body).includes("@"), "endpoint nie może ujawniać adresu wyzywającego");

  const ans = await captureLog(() => post(`/api/challenge/${id}/answer`, { nick: "Anna", score: 91 }));
  assert.match(ans, /Tw[óo]j wynik pobity/, "powiadomienie mówi o pobiciu wyniku");
  assert.match(ans, /wyzywajacy@example\.com/, "powiadomienie leci do wyzywającego");
  // Polski czas przeszły jest rodzajowy — szablon nie może zgadywać rodzaju z nicku.
  assert.doesNotMatch(ans, /\b(pobił|pobiła|zagrał|zagrała|zdobył|zdobyła)\b/,
    "szablon musi używać form neutralnych rodzajowo");

  const again = await post(`/api/challenge/${id}/answer`, { nick: "Anna", score: 99 });
  assert.strictEqual(again.status, 409, "drugiej odpowiedzi nie przyjmujemy");

  const after = await get(`/api/challenge/${id}`);
  assert.strictEqual(after.body.status, "answered");
  assert.strictEqual(after.body.answer.score, 91);
});

test("nie można wyzwać samego siebie", async () => {
  const out = await captureLog(() => post("/api/request-code", { email: "solo@example.com", nick: "Samotnik" }));
  const code = out.match(/rankingu:\s*(\d{6})/)[1];
  const saved = await post("/api/submit-score",
    { email: "solo@example.com", nick: "Samotnik", code, score: 50, scenario: "FENIKS" });

  const r = await post("/api/challenge",
    { ticket: saved.body.challengeTicket, targetName: "Ja", targetEmail: "solo@example.com" });
  assert.strictEqual(r.status, 400);
  assert.match(r.body.error, /samego siebie/);
});

test("wyzwanie bez ważnego biletu jest odrzucane", async () => {
  const r = await post("/api/challenge",
    { ticket: "nieistniejacy", targetName: "Anna", targetEmail: "anna2@example.com" });
  assert.strictEqual(r.status, 400);
  assert.match(r.body.error, /Bilet wygasł/);
});

test("nick w mailu pochodzi z bazy — pole w żądaniu jest ignorowane", async () => {
  const out = await captureLog(() => post("/api/request-code", { email: "spryciarz@example.com", nick: "Grzeczny" }));
  const code = out.match(/rankingu:\s*(\d{6})/)[1];
  const saved = await post("/api/submit-score",
    { email: "spryciarz@example.com", nick: "Grzeczny", code, score: 40, scenario: "FENIKS" });

  const mail = await captureLog(() => post("/api/challenge", {
    ticket: saved.body.challengeTicket, targetName: "Ofiara", targetEmail: "ofiara@example.com",
    nick: "OBELGA", challengerNick: "OBELGA",          // próba wstrzyknięcia własnego tekstu
  }));
  assert.ok(!mail.includes("OBELGA"), "tekst z żądania nie może trafić do maila");
  assert.match(mail, /Grzeczny wyzywa Cię/);
});

test("odpowiedź na nieistniejące wyzwanie zwraca 404", async () => {
  const r = await post("/api/challenge/" + "0".repeat(32) + "/answer", { nick: "Ktos", score: 10 });
  assert.strictEqual(r.status, 404);
});

test("wynik poza zakresem 0-100 jest odrzucany przy odpowiedzi", async () => {
  const out = await captureLog(() => post("/api/request-code", { email: "zakres@example.com", nick: "Tester" }));
  const code = out.match(/rankingu:\s*(\d{6})/)[1];
  const saved = await post("/api/submit-score",
    { email: "zakres@example.com", nick: "Tester", code, score: 30, scenario: "FENIKS" });
  const mail = await captureLog(() => post("/api/challenge",
    { ticket: saved.body.challengeTicket, targetName: "Bob", targetEmail: "bob@example.com" }));
  const id = mail.match(/[?&]w=([0-9a-f]{32})/)[1];

  const r = await post(`/api/challenge/${id}/answer`, { nick: "Bob", score: 150 });
  assert.strictEqual(r.status, 400);
  assert.match(r.body.error, /0–100/);
});

test("limit na adres docelowy blokuje trzecie wyzwanie tego samego dnia", async () => {
  const wyslij = async (nr) => {
    const out = await captureLog(() => post("/api/request-code", { email: `nadawca${nr}@example.com`, nick: `Nadawca${nr}` }));
    const code = out.match(/rankingu:\s*(\d{6})/)[1];
    const saved = await post("/api/submit-score",
      { email: `nadawca${nr}@example.com`, nick: `Nadawca${nr}`, code, score: 60, scenario: "FENIKS" });
    return post("/api/challenge",
      { ticket: saved.body.challengeTicket, targetName: "Cel", targetEmail: "bombardowany@example.com" });
  };
  assert.strictEqual((await wyslij(1)).status, 200);
  assert.strictEqual((await wyslij(2)).status, 200);
  const trzeci = await wyslij(3);
  assert.strictEqual(trzeci.status, 429, "trzecie wyzwanie na ten sam adres — od innego nadawcy — musi odpaść");
  assert.match(trzeci.body.error, /już dziś wyzwanie/);
});
