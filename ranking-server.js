/**
 * Backend rankingu gry „Sekcja zwłok projektu"
 * ---------------------------------------------
 * Uruchomienie:
 *   npm install
 *   SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... \
 *   MAIL_FROM="Sekcja Zwłok <ranking@example.com>" \
 *   GAME_URL="https://twoja-domena/sekcja-zwlok.html" CHALLENGE_SALT="losowy-ciag" \
 *   PORT=3001 node ranking-server.js
 *
 * Następnie w sekcja-zwlok.html ustaw: const RANKING_API = "https://twoj-serwer:3001";
 * Bez SMTP_HOST działa tryb deweloperski: treść maili i linki lądują na konsoli.
 * Bez GAME_URL pojedynki są wyłączone (nie da się zbudować linku w zaproszeniu).
 *
 * Dane: SQLite (node:sqlite, wbudowany w Node 22+; bez zależności natywnych).
 * Plik bazy: DB_FILE, domyślnie ranking.db obok skryptu. Przy pierwszym starcie
 * istniejący ranking-data.json jest przepisywany do bazy i zmieniany na
 * ranking-data.json.migrated — operacja jednorazowa i nieniszcząca.
 *
 * Endpointy:
 *   POST /api/request-code        {email, nick}                    -> wysyła 6-cyfrowy kod na email
 *   POST /api/submit-score        {email, nick, code, score, scenario, challengeId?}
 *                                                                  -> weryfikuje kod, zapisuje wynik,
 *                                                                     zwraca bilet na wyzwanie,
 *                                                                     opcjonalnie rozstrzyga pojedynek
 *   GET  /api/leaderboard                                          -> top 50, e-maile ZAMASKOWANE
 *   POST /api/challenge           {ticket, targetName, targetEmail} -> wysyła zaproszenie do pojedynku
 *   GET  /api/challenge/:id                                        -> dane wyzwania do wyświetlenia
 *   POST /api/challenge/:id/answer {nick, score}                   -> odpowiedź anonimowa
 *
 * Prywatność: pełne e-maile żyją tylko w bazie na serwerze; API publiczne
 * zwraca wyłącznie maskę (pierwsze 3 + ostatnie 3 znaki, reszta '#').
 * Kody: ważne 10 minut, max 5 prób, limit 3 wysyłek / 15 min / email.
 *
 * Pojedynki: adres osoby wyzwanej NIE jest przechowywany — limit zaproszeń na
 * adres liczony jest po nieodwracalnym skrócie z solą. Rekord wyzwania zawiera
 * wyłącznie adres wyzywającego (już w rankingu za zgodą). Treść zaproszenia to
 * sztywny szablon, a nick pochodzi z bazy, nie z żądania, więc serwera nie da
 * się użyć jako przekaźnika dowolnych wiadomości.
 * Limity: 5 zaproszeń / dobę / nadawcę, 2 / dobę / adres docelowy.
 * Bilet: 60 minut, jednorazowy. Wyzwanie: 14 dni, jedna odpowiedź.
 *
 * Kody, bilety i liczniki limitów żyją w bazie, nie w pamięci — restart serwera
 * nie kasuje aktywnych kodów ani nie resetuje ochrony przed spamem.
 */

const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = process.env.PORT || 3001;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, "ranking.db");
const LEGACY_FILE = process.env.DATA_FILE || path.join(__dirname, "ranking-data.json");
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SEND_LIMIT = { count: 3, windowMs: 15 * 60 * 1000 };

// ---------- pojedynki ----------
// GAME_URL jest wymagany do zbudowania linku w mailu; jego brak wyłącza całą
// funkcję wyzwań, tak jak brak SMTP_HOST wyłącza wysyłkę maili.
const GAME_URL = process.env.GAME_URL || "";
// Sól do skrótów adresów docelowych. Bez niej gotowe tablice popularnych adresów
// rozbroiłyby limit. Losowa przy braku zmiennej — wtedy limity per adres tracą
// ciągłość po restarcie, bo skróty przestają pasować do zapisanych.
const CHALLENGE_SALT = process.env.CHALLENGE_SALT || crypto.randomBytes(32).toString("hex");
const TICKET_TTL_MS = 60 * 60 * 1000;
const CHALLENGE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const CHALLENGE_LIMIT = { perChallenger: 5, perTarget: 2, windowMs: 24 * 60 * 60 * 1000 };

// ---------- baza ----------
const sql = new DatabaseSync(DB_FILE);
sql.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS scores (
    email TEXT NOT NULL, nick TEXT NOT NULL, score INTEGER NOT NULL,
    scenario TEXT NOT NULL, date TEXT NOT NULL,
    PRIMARY KEY (email, scenario)
  );
  CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    challenger_email TEXT NOT NULL, challenger_nick TEXT NOT NULL,
    score INTEGER NOT NULL, scenario TEXT NOT NULL,
    created TEXT NOT NULL, expires INTEGER NOT NULL,
    answer_nick TEXT, answer_score INTEGER, answer_date TEXT, answer_verified INTEGER
  );
  CREATE TABLE IF NOT EXISTS codes (
    email TEXT PRIMARY KEY, code TEXT NOT NULL,
    expires INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS tickets (
    ticket TEXT PRIMARY KEY, email TEXT NOT NULL,
    scenario TEXT NOT NULL, expires INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS rate_limits (
    bucket TEXT NOT NULL, key TEXT NOT NULL, ts INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_rate ON rate_limits(bucket, key, ts);
  CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
`);

// Migracja ze starego pliku JSON. Warunek „baza pusta" sprawia, że ponowny start
// nie duplikuje danych; oryginał zostaje na dysku pod zmienioną nazwą.
function migrateLegacy() {
  if (sql.prepare("SELECT COUNT(*) n FROM scores").get().n > 0) return;
  if (!fs.existsSync(LEGACY_FILE)) return;
  let stare;
  try { stare = JSON.parse(fs.readFileSync(LEGACY_FILE, "utf-8")); }
  catch (e) { console.error("Migracja: nie udało się odczytać", LEGACY_FILE, "-", e.message); return; }

  const wstawWynik = sql.prepare(
    "INSERT OR REPLACE INTO scores (email, nick, score, scenario, date) VALUES (?, ?, ?, ?, ?)");
  const wstawWyzwanie = sql.prepare(`INSERT OR REPLACE INTO challenges
    (id, challenger_email, challenger_nick, score, scenario, created, expires,
     answer_nick, answer_score, answer_date, answer_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  let w = 0, p = 0;
  for (const s of stare.scores || []) {
    wstawWynik.run(s.email, s.nick, s.score, s.scenario, s.date || new Date().toISOString()); w++;
  }
  for (const c of stare.challenges || []) {
    const a = c.answer || {};
    wstawWyzwanie.run(c.id, c.challengerEmail, c.challengerNick, c.score, c.scenario,
      c.created, c.expires, a.nick ?? null, a.score ?? null, a.date ?? null,
      c.answer ? (a.verified ? 1 : 0) : null); p++;
  }
  fs.renameSync(LEGACY_FILE, LEGACY_FILE + ".migrated");
  console.log(`Migracja z ${path.basename(LEGACY_FILE)}: ${w} wyników, ${p} pojedynków.`);
}
migrateLegacy();

// Magazyny limitów wystawiają interfejs get/set zgodny z Map, więc te same
// funkcje przesuwanego okna działają i na bazie, i na Mapie w testach.
function limitStore(bucket) {
  const czytaj = sql.prepare("SELECT ts FROM rate_limits WHERE bucket = ? AND key = ?");
  const kasuj = sql.prepare("DELETE FROM rate_limits WHERE bucket = ? AND key = ?");
  const wstaw = sql.prepare("INSERT INTO rate_limits (bucket, key, ts) VALUES (?, ?, ?)");
  return {
    get: key => czytaj.all(bucket, key).map(r => r.ts),
    set: (key, arr) => {
      kasuj.run(bucket, key);
      for (const ts of arr) wstaw.run(bucket, key, ts);
    },
  };
}
const sendLog = limitStore("send");
const challengerLog = limitStore("challenger");
const targetLog = limitStore("target");

const codes = {
  get: email => sql.prepare("SELECT code, expires, attempts FROM codes WHERE email = ?").get(email) || undefined,
  set: (email, v) => sql.prepare(
    "INSERT OR REPLACE INTO codes (email, code, expires, attempts) VALUES (?, ?, ?, ?)")
    .run(email, v.code, v.expires, v.attempts),
  delete: email => sql.prepare("DELETE FROM codes WHERE email = ?").run(email),
};

const tickets = {
  get: t => sql.prepare("SELECT email, scenario, expires FROM tickets WHERE ticket = ?").get(t) || undefined,
  set: (t, v) => sql.prepare(
    "INSERT OR REPLACE INTO tickets (ticket, email, scenario, expires) VALUES (?, ?, ?, ?)")
    .run(t, v.email, v.scenario, v.expires),
  delete: t => sql.prepare("DELETE FROM tickets WHERE ticket = ?").run(t),
};

// ---------- mail ----------
const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
}) : null;

// Jedno miejsce wysyłki: bez SMTP treść ląduje na konsoli, dzięki czemu cały
// przepływ (kody, wyzwania, powiadomienia) da się przejść lokalnie bez maili.
async function sendMail(to, subject, text) {
  if (!mailer) {
    console.log(`\n[DEV] ─── mail do ${to} ───\n${subject}\n\n${text}\n────────────────────\n`);
    return true;
  }
  try {
    await mailer.sendMail({ from: process.env.MAIL_FROM || "ranking@localhost", to, subject, text });
    return true;
  } catch (e) {
    console.error("Mail error:", e.message);
    return false;
  }
}

// ---------- helpers ----------
function maskEmail(e) {
  e = String(e);
  if (e.length <= 6) return e[0] + "#".repeat(Math.max(1, e.length - 2)) + e[e.length - 1];
  return e.slice(0, 3) + "#".repeat(e.length - 6) + e.slice(-3);
}
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120;
const validNick = n => typeof n === "string" && n.trim().length >= 3 && n.trim().length <= 20;

// ---------- pojedynki: funkcje pomocnicze ----------
// Skrót jednokierunkowy: pozwala odpowiedzieć na „czy widziałem już ten adres",
// ale nie na „jakie adresy widziałem". Adresu wyzwanego nie zapisujemy nigdzie.
const hashTarget = e => crypto.createHash("sha256")
  .update(CHALLENGE_SALT + String(e).trim().toLowerCase()).digest("hex");

// Przesuwane okno rozbite na sprawdzenie i zapis, żeby odrzucone żądanie nie
// konsumowało limitu drugiej strony. `now` jako parametr — testowalne bez czekania.
// `log` to dowolny obiekt z get/set: Map w testach, magazyn na bazie w produkcji.
function limitExceeded(log, key, max, windowMs, now = Date.now()) {
  const hits = (log.get(key) || []).filter(t => now - t < windowMs);
  log.set(key, hits);
  return hits.length >= max;
}
function recordHit(log, key, now = Date.now()) {
  const hits = log.get(key) || [];
  hits.push(now);
  log.set(key, hits);
}

function issueTicket(email, scenario, now = Date.now()) {
  const t = crypto.randomBytes(24).toString("hex");
  tickets.set(t, { email, scenario, expires: now + TICKET_TTL_MS });
  return t;
}
function consumeTicket(t, now = Date.now()) {   // jednorazowy: jeden zapis wyniku = jedno wyzwanie
  const entry = tickets.get(t);
  if (!entry) return null;
  tickets.delete(t);
  return now > entry.expires ? null : entry;
}

// Wiersz bazy -> kształt używany przez resztę kodu (i przez testy challengeStatus).
function rowToChallenge(r) {
  if (!r) return null;
  return {
    id: r.id, challengerEmail: r.challenger_email, challengerNick: r.challenger_nick,
    score: r.score, scenario: r.scenario, created: r.created, expires: r.expires,
    answer: r.answer_nick == null ? null
      : { nick: r.answer_nick, score: r.answer_score, date: r.answer_date, verified: !!r.answer_verified },
  };
}
const findChallenge = id =>
  rowToChallenge(sql.prepare("SELECT * FROM challenges WHERE id = ?").get(String(id)));

function challengeStatus(c, now = Date.now()) {
  if (c.answer) return "answered";
  if (now > c.expires) return "expired";
  return "open";
}

// Wspólne rozstrzygnięcie dla obu dróg wyzwanego (anonimowej i zweryfikowanej).
// Awaria SMTP nie może cofnąć zapisanej odpowiedzi — wyzwany nie odpowiada za
// cudzy serwer pocztowy.
async function resolveChallenge(c, nick, score, verified) {
  const date = new Date().toISOString();
  sql.prepare(`UPDATE challenges SET answer_nick = ?, answer_score = ?, answer_date = ?,
               answer_verified = ? WHERE id = ?`).run(nick, score, date, verified ? 1 : 0, c.id);
  c.answer = { nick, score, date, verified };
  const beat = score > c.score;
  // Formy neutralne rodzajowo: polski czas przeszły odmienia się przez rodzaj,
  // a nick nie mówi nic o tym, kim jest gracz.
  await sendMail(
    c.challengerEmail,
    beat ? `Twój wynik pobity — ${nick}: ${score}/100` : `${nick} odpowiada na Twoje wyzwanie`,
    `Cześć ${c.challengerNick}!\n\n` +
    `Sprawa ${c.scenario} — wynik gracza ${nick}: ${score}/100.\n` +
    `Twój wynik: ${c.score}/100.\n\n` +
    (beat ? "Wyzwanie przyjęte i wygrane. Rewanż należy do Ciebie.\n"
          : "Twój rekord się obronił.\n") +
    `\nTo jedyna wiadomość w sprawie tego pojedynku.\n`
  );
  return { beat };
}

function challengeMailText(targetName, challengerNick, score, scenario, link) {
  return `Cześć ${targetName}!\n\n` +
    `${challengerNick} wyzywa Cię na pojedynek w grze „Sekcja zwłok projektu" — ` +
    `symulatorze post-mortem, w którym przesłuchujesz świadków upadłego projektu.\n\n` +
    `Wynik do pobicia: ${score}/100 (sprawa ${scenario}).\n\n` +
    `Podejmij wyzwanie: ${link}\n\n` +
    `Twój adres wskazał gracz ${challengerNick} wyłącznie po to, żeby doręczyć to zaproszenie. ` +
    `Nie zapisaliśmy go i nie przyjdzie od nas żadna kolejna wiadomość. ` +
    `Jeśli to pomyłka — po prostu zignoruj tego maila.\n`;
}

// ---------- app ----------
const app = express();
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {           // CORS
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.post("/api/request-code", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const nick = String(req.body.nick || "").trim();
  if (!validEmail(email)) return res.status(400).json({ error: "Nieprawidłowy adres e-mail." });
  if (!validNick(nick)) return res.status(400).json({ error: "Nick: 3–20 znaków." });

  if (limitExceeded(sendLog, email, SEND_LIMIT.count, SEND_LIMIT.windowMs))
    return res.status(429).json({ error: "Za dużo prób. Spróbuj za kilkanaście minut." });
  recordHit(sendLog, email);

  const code = String(crypto.randomInt(100000, 1000000));
  codes.set(email, { code, expires: Date.now() + CODE_TTL_MS, attempts: 0 });

  const sent = await sendMail(email, "Twój kod autoryzacyjny — Sekcja zwłok projektu",
    `Cześć ${nick}!\n\nTwój kod autoryzacyjny do zapisania wyniku w rankingu: ${code}\n\nKod jest ważny 10 minut. Jeśli to nie Ty — zignoruj tę wiadomość.\n`);
  if (!sent) return res.status(502).json({ error: "Nie udało się wysłać maila. Spróbuj później." });
  res.json({ ok: true, dev: !mailer });
});

app.post("/api/submit-score", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const nick = String(req.body.nick || "").trim();
  const code = String(req.body.code || "").trim();
  const score = parseInt(req.body.score, 10);
  const scenario = String(req.body.scenario || "").slice(0, 40);

  if (!validEmail(email) || !validNick(nick)) return res.status(400).json({ error: "Nieprawidłowe dane." });
  if (!(score >= 0 && score <= 100)) return res.status(400).json({ error: "Wynik poza zakresem 0–100." });

  const entry = codes.get(email);
  if (!entry || Date.now() > entry.expires) return res.status(400).json({ error: "Kod wygasł — poproś o nowy." });
  entry.attempts++;
  codes.set(email, entry);            // baza nie zapamięta mutacji obiektu — zapis jest jawny
  if (entry.attempts > MAX_ATTEMPTS) { codes.delete(email); return res.status(429).json({ error: "Za dużo błędnych prób." }); }
  if (entry.code !== code) return res.status(400).json({ error: "Nieprawidłowy kod autoryzacyjny." });
  codes.delete(email);

  // jeden wpis na email+scenariusz — zostaje najlepszy wynik
  const existing = sql.prepare("SELECT score FROM scores WHERE email = ? AND scenario = ?").get(email, scenario);
  if (!existing) {
    sql.prepare("INSERT INTO scores (email, nick, score, scenario, date) VALUES (?, ?, ?, ?, ?)")
      .run(email, nick, score, scenario, new Date().toISOString());
  } else if (score > existing.score) {
    sql.prepare("UPDATE scores SET score = ?, nick = ?, date = ? WHERE email = ? AND scenario = ?")
      .run(score, nick, new Date().toISOString(), email, scenario);
  }

  // Zweryfikowana droga odpowiedzi na wyzwanie: ten sam zapis wyniku rozstrzyga pojedynek.
  let duel = null;
  const cid = String(req.body.challengeId || "").trim();
  if (cid) {
    const c = findChallenge(cid);
    if (c && challengeStatus(c) === "open") {
      const { beat } = await resolveChallenge(c, nick, score, true);
      duel = { beat, target: c.score, challenger: c.challengerNick };
    }
  }

  // Bilet pozwala wysłać wyzwanie zaraz po zapisie, bez drugiej rundy kodu.
  res.json({ ok: true, challengeTicket: GAME_URL ? issueTicket(email, scenario) : null, duel });
});

app.get("/api/leaderboard", (req, res) => {
  const entries = sql.prepare("SELECT nick, email, score, scenario, date FROM scores ORDER BY score DESC LIMIT 50")
    .all()
    .map(s => ({ nick: s.nick, email: maskEmail(s.email), score: s.score, scenario: s.scenario, date: s.date }));
  res.json({ entries });   // nigdy nie zwracamy pełnych e-maili
});

// ---------- pojedynki ----------
app.post("/api/challenge", async (req, res) => {
  if (!GAME_URL) return res.status(503).json({ error: "Pojedynki są wyłączone na tym serwerze." });

  const targetName = String(req.body.targetName || "").trim().slice(0, 40);
  const targetEmail = String(req.body.targetEmail || "").trim().toLowerCase();
  const t = consumeTicket(String(req.body.ticket || "").trim());

  if (!t) return res.status(400).json({ error: "Bilet wygasł. Wyzwanie wysyła się zaraz po zapisaniu wyniku." });
  if (targetName.length < 2) return res.status(400).json({ error: "Podaj imię osoby, którą wyzywasz." });
  if (!validEmail(targetEmail)) return res.status(400).json({ error: "Nieprawidłowy adres e-mail." });
  if (targetEmail === t.email) return res.status(400).json({ error: "Nie możesz wyzwać samego siebie." });

  // Nick i wynik pochodzą z bazy rankingu, nie z żądania: mail może zawierać
  // wyłącznie tekst, który nadawca już opublikował pod zweryfikowanym adresem.
  const me = sql.prepare("SELECT nick, score, scenario FROM scores WHERE email = ? AND scenario = ?")
    .get(t.email, t.scenario);
  if (!me) return res.status(400).json({ error: "Nie znaleziono Twojego wyniku dla tego scenariusza." });

  const th = hashTarget(targetEmail);
  if (limitExceeded(challengerLog, t.email, CHALLENGE_LIMIT.perChallenger, CHALLENGE_LIMIT.windowMs))
    return res.status(429).json({ error: "Dzienny limit wyzwań wyczerpany. Wróć jutro." });
  if (limitExceeded(targetLog, th, CHALLENGE_LIMIT.perTarget, CHALLENGE_LIMIT.windowMs))
    return res.status(429).json({ error: "Ta osoba dostała już dziś wyzwanie. Spróbuj jutro." });

  const id = crypto.randomBytes(16).toString("hex");
  const link = GAME_URL + (GAME_URL.includes("?") ? "&" : "?") + "w=" + id;

  // Zapis dopiero po udanej wysyłce — inaczej zostałby wpis z linkiem, którego nikt nie dostał.
  const sent = await sendMail(targetEmail,
    `${me.nick} wyzywa Cię na pojedynek — Sekcja zwłok projektu`,
    challengeMailText(targetName, me.nick, me.score, me.scenario, link));
  if (!sent) return res.status(502).json({ error: "Nie udało się wysłać wiadomości. Spróbuj później." });

  sql.prepare(`INSERT INTO challenges
    (id, challenger_email, challenger_nick, score, scenario, created, expires)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, t.email, me.nick, me.score, me.scenario,
         new Date().toISOString(), Date.now() + CHALLENGE_TTL_MS);
  recordHit(challengerLog, t.email);
  recordHit(targetLog, th);
  res.json({ ok: true });
});

app.get("/api/challenge/:id", (req, res) => {
  const c = findChallenge(String(req.params.id));
  if (!c) return res.status(404).json({ error: "Nie znaleziono wyzwania." });
  const status = challengeStatus(c);
  res.json({                                  // nigdy nie zwracamy adresu wyzywającego
    nick: c.challengerNick, score: c.score, scenario: c.scenario, status,
    answer: status === "answered" ? { nick: c.answer.nick, score: c.answer.score } : null,
  });
});

app.post("/api/challenge/:id/answer", async (req, res) => {
  const c = findChallenge(String(req.params.id));
  if (!c) return res.status(404).json({ error: "Nie znaleziono wyzwania." });
  const status = challengeStatus(c);
  if (status === "answered") return res.status(409).json({ error: "Ten pojedynek został już rozstrzygnięty." });
  if (status === "expired") return res.status(410).json({ error: "To wyzwanie wygasło." });

  const nick = String(req.body.nick || "").trim();
  const score = parseInt(req.body.score, 10);
  if (!validNick(nick)) return res.status(400).json({ error: "Nick: 3–20 znaków." });
  if (!(score >= 0 && score <= 100)) return res.status(400).json({ error: "Wynik poza zakresem 0–100." });

  const { beat } = await resolveChallenge(c, nick, score, false);
  res.json({ ok: true, beat, target: c.score, challenger: c.challengerNick });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(
    `Ranking server: http://localhost:${PORT} ${mailer ? "(SMTP aktywny)" : "(DEV — maile w konsoli)"}` +
    `${GAME_URL ? "" : " (pojedynki wyłączone — brak GAME_URL)"} · baza: ${path.basename(DB_FILE)}`));
}

module.exports = {                            // powierzchnia dla testów jednostkowych
  app, sql, tickets, codes, challengerLog, targetLog,
  hashTarget, limitExceeded, recordHit, issueTicket, consumeTicket,
  findChallenge, challengeStatus, maskEmail, validEmail, validNick,
  CHALLENGE_LIMIT, TICKET_TTL_MS, CHALLENGE_TTL_MS,
};
