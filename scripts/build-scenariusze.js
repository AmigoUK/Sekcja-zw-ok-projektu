#!/usr/bin/env node
/**
 * Wstrzykuje scenariusze z gpt/*.md do sekcja-zwlok.html.
 *
 * Gra musi zostać jednym plikiem działającym z dysku (file:// nie pozwala na fetch),
 * a treść scenariuszy ma jedno źródło wspólne z Custom GPT. Stąd krok budowania:
 * pliki .md → blok // <scenariusze> w HTML. Test pilnuje, żeby blok był aktualny.
 */
const fs = require("node:fs");
const path = require("node:path");
const S = require("./scenariusze.js");

const ROOT = path.join(__dirname, "..");
const GPT = path.join(ROOT, "gpt");
const HTML = path.join(ROOT, "sekcja-zwlok.html");
const START = "// <scenariusze>", KONIEC = "// </scenariusze>";

function wczytajKatalog(dir = GPT) {
  const pliki = fs.readdirSync(dir).filter(f => /^scenariusz-\d+-.+\.md$/.test(f)).sort();
  const lista = [], bledy = [];
  for (const f of pliki) {
    const { meta, tresc } = S.parsujFrontMatter(fs.readFileSync(path.join(dir, f), "utf-8"));
    const b = S.walidujScenariusz(meta, tresc, f);
    bledy.push(...b);
    if (!b.length) lista.push({ meta, tlo: S.wyciagnijTlo(tresc), tresc });
  }
  bledy.push(...S.walidujKatalog(lista.map(s => s.meta)));
  return { lista: S.sortujKatalog(lista), bledy };
}

function wczytajSilnik(dir = GPT) {
  return fs.readFileSync(path.join(dir, "silnik-gra.md"), "utf-8").trim();
}

// „</" w treści zamknąłby tag <script> — w JS-owym stringu „<\/" znaczy to samo.
const js = v => JSON.stringify(v).replace(/<\//g, "<\\/");

function zbudujBlok(lista, silnik) {
  return [
    START,
    "  // Generowane przez `npm run build` z plików gpt/*.md — nie edytuj ręcznie.",
    `  const SILNIK = ${js(silnik)};`,
    `  const SCENARIUSZE = ${js(lista)};`,
    "  " + KONIEC,
  ].join("\n");
}

function wstrzyknij(html, blok) {
  const a = html.indexOf(START), b = html.indexOf(KONIEC);
  if (a < 0 || b < a) throw new Error("brak znaczników // <scenariusze> … // </scenariusze> w HTML");
  return html.slice(0, a) + blok.trimStart() + html.slice(b + KONIEC.length);
}

if (require.main === module) {
  const { lista, bledy } = wczytajKatalog();
  if (bledy.length) {
    console.error("Błędy w scenariuszach:\n  " + bledy.join("\n  "));
    process.exit(1);
  }
  const stary = fs.readFileSync(HTML, "utf-8");
  const nowy = wstrzyknij(stary, zbudujBlok(lista, wczytajSilnik()));
  if (nowy !== stary) fs.writeFileSync(HTML, nowy);
  console.log(`OK: ${lista.length} scenariuszy${nowy === stary ? " (bez zmian)" : " → sekcja-zwlok.html"}`);
}

module.exports = { wczytajKatalog, wczytajSilnik, zbudujBlok, wstrzyknij };
