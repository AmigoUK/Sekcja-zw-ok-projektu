/**
 * Backend rankingu gry „Sekcja zwłok projektu"
 * ---------------------------------------------
 * Uruchomienie:
 *   npm install express nodemailer
 *   SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... \
 *   MAIL_FROM="Sekcja Zwłok <ranking@example.com>" PORT=3001 node ranking-server.js
 *
 * Następnie w sekcja-zwlok.html ustaw: const RANKING_API = "https://twoj-serwer:3001";
 *
 * Endpointy:
 *   POST /api/request-code  {email, nick}                  -> wysyła 6-cyfrowy kod na email
 *   POST /api/submit-score  {email, nick, code, score, scenario} -> weryfikuje kod, zapisuje wynik
 *   GET  /api/leaderboard                                  -> top 50, e-maile ZAMASKOWANE
 *
 * Prywatność: pełne e-maile żyją tylko w pliku danych na serwerze; API publiczne
 * zwraca wyłącznie maskę (pierwsze 3 + ostatnie 3 znaki, reszta '#').
 * Kody: ważne 10 minut, max 5 prób, limit 3 wysyłek / 15 min / email.
 */

const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "ranking-data.json");
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SEND_LIMIT = { count: 3, windowMs: 15 * 60 * 1000 };

// ---------- storage ----------
let db = { scores: [] };
try { db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); } catch (_) {}
function saveDb() { fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }

const codes = new Map();     // email -> {code, expires, attempts}
const sendLog = new Map();   // email -> [timestamps]

// ---------- mail ----------
const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
}) : null;

// ---------- helpers ----------
function maskEmail(e) {
  e = String(e);
  if (e.length <= 6) return e[0] + "#".repeat(Math.max(1, e.length - 2)) + e[e.length - 1];
  return e.slice(0, 3) + "#".repeat(e.length - 6) + e.slice(-3);
}
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120;
const validNick = n => typeof n === "string" && n.trim().length >= 3 && n.trim().length <= 20;

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

  const now = Date.now();
  const log = (sendLog.get(email) || []).filter(t => now - t < SEND_LIMIT.windowMs);
  if (log.length >= SEND_LIMIT.count)
    return res.status(429).json({ error: "Za dużo prób. Spróbuj za kilkanaście minut." });
  log.push(now); sendLog.set(email, log);

  const code = String(crypto.randomInt(100000, 1000000));
  codes.set(email, { code, expires: now + CODE_TTL_MS, attempts: 0 });

  if (!mailer) {
    console.log(`[DEV] Kod dla ${email}: ${code}`);   // tryb deweloperski bez SMTP
    return res.json({ ok: true, dev: true });
  }
  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM || "ranking@localhost",
      to: email,
      subject: "Twój kod autoryzacyjny — Sekcja zwłok projektu",
      text: `Cześć ${nick}!\n\nTwój kod autoryzacyjny do zapisania wyniku w rankingu: ${code}\n\nKod jest ważny 10 minut. Jeśli to nie Ty — zignoruj tę wiadomość.\n`,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("Mail error:", e.message);
    res.status(502).json({ error: "Nie udało się wysłać maila. Spróbuj później." });
  }
});

app.post("/api/submit-score", (req, res) => {
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
  if (entry.attempts > MAX_ATTEMPTS) { codes.delete(email); return res.status(429).json({ error: "Za dużo błędnych prób." }); }
  if (entry.code !== code) return res.status(400).json({ error: "Nieprawidłowy kod autoryzacyjny." });
  codes.delete(email);

  // jeden wpis na email+scenariusz — zostaje najlepszy wynik
  const existing = db.scores.find(s => s.email === email && s.scenario === scenario);
  if (existing) { if (score > existing.score) { existing.score = score; existing.nick = nick; existing.date = new Date().toISOString(); } }
  else db.scores.push({ email, nick, score, scenario, date: new Date().toISOString() });
  saveDb();
  res.json({ ok: true });
});

app.get("/api/leaderboard", (req, res) => {
  const entries = db.scores
    .slice().sort((a, b) => b.score - a.score).slice(0, 50)
    .map(s => ({ nick: s.nick, email: maskEmail(s.email), score: s.score, scenario: s.scenario, date: s.date }));
  res.json({ entries });   // nigdy nie zwracamy pełnych e-maili
});

app.listen(PORT, () => console.log(`Ranking server: http://localhost:${PORT} ${mailer ? "(SMTP aktywny)" : "(DEV — kody w konsoli)"}`));
