/**
 * Ranking z filtrem sprawy. Osobna baza tymczasowa — testy nie dotykają ranking.db.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const TMP_DB = path.join(os.tmpdir(), `ranking-filtr-${process.pid}.db`);
process.env.DB_FILE = TMP_DB;
process.env.DATA_FILE = path.join(os.tmpdir(), `nieistniejacy-filtr-${process.pid}.json`);
delete process.env.SMTP_HOST;
const srv = require("../ranking-server.js");

test.after(() => {
  for (const f of [TMP_DB, TMP_DB + "-wal", TMP_DB + "-shm"]) try { fs.unlinkSync(f); } catch (_) {}
});

let base;
const server = srv.app.listen(0);
test.before(() => new Promise(r => {
  const ok = () => { base = `http://localhost:${server.address().port}`; r(); };
  server.listening ? ok() : server.once("listening", ok);
}));
test.after(() => server.close());
const get = p => fetch(base + p).then(r => r.json());

test.before(() => {
  const ins = srv.sql.prepare("INSERT INTO scores (email, nick, score, scenario, date) VALUES (?, ?, ?, ?, ?)");
  ins.run("a@test.pl", "Ala", 90, "FENIKS", "2026-10-01");
  ins.run("b@test.pl", "Bob", 70, "CHLODNIA", "2026-10-02");
  ins.run("c@test.pl", "Cyd", 80, "CHLODNIA", "2026-10-03");
});

test("leaderboard bez parametru: wszystkie sprawy, malejąco", async () => {
  const { entries } = await get("/api/leaderboard");
  assert.deepStrictEqual(entries.map(e => e.nick), ["Ala", "Cyd", "Bob"]);
});

test("leaderboard?scenario: tylko wskazana sprawa", async () => {
  const { entries } = await get("/api/leaderboard?scenario=CHLODNIA");
  assert.deepStrictEqual(entries.map(e => [e.nick, e.scenario]), [["Cyd", "CHLODNIA"], ["Bob", "CHLODNIA"]]);
});

test("leaderboard?scenario: nieznana sprawa to pusta lista, nie błąd", async () => {
  assert.deepStrictEqual((await get("/api/leaderboard?scenario=NIE_MA")).entries, []);
});

test("leaderboard: adresy zawsze maskowane", async () => {
  const { entries } = await get("/api/leaderboard?scenario=FENIKS");
  assert.ok(!entries[0].email.includes("a@test.pl"));
});
