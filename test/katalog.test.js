/**
 * Testy czystych funkcji ekranu wyboru sprawy. Ten sam wzorzec co emocje:
 * blok // <katalog> wycinamy z HTML i wykonujemy w izolacji.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { DOMENY } = require("../scripts/scenariusze.js");

const HTML = fs.readFileSync(path.join(__dirname, "..", "sekcja-zwlok.html"), "utf-8");
const blok = HTML.match(/\/\/ <katalog>([\s\S]*?)\/\/ <\/katalog>/);
assert.ok(blok, "nie znaleziono bloku // <katalog> … // </katalog> w sekcja-zwlok.html");
const ctx = vm.createContext({});
vm.runInContext(blok[1] + `
  globalThis.API = { DOMENY_UI, FLAGI, grupujScenariusze, wybierzStartowy,
                     rozpoznajMowce, pierwszeZdanie, kropkiPoziomu };
`, ctx);
const K = ctx.API;

const sp = (id, domena, poziom) => ({ meta: { id, domena, poziom }, tlo: "", tresc: "" });
const LISTA = [sp("BILBORD", "projekty", 1), sp("FENIKS", "projekty", 2),
               sp("CHLODNIA", "zywnosc", 2), sp("WYCIEK", "rodo", 3)];

test("każda domena z walidatora ma etykietę w UI", () => {
  for (const d of DOMENY) assert.ok(K.DOMENY_UI[d], `brak DOMENY_UI.${d}`);
});

test("grupujScenariusze: kolejność domen, puste grupy pominięte", () => {
  const g = K.grupujScenariusze([sp("WYCIEK", "rodo", 3), sp("FENIKS", "projekty", 2)]);
  assert.deepStrictEqual([...g.map(x => x.domena)], ["projekty", "rodo"]);
  assert.deepStrictEqual([...g[0].sprawy.map(s => s.meta.id)], ["FENIKS"]);
});

test("wybierzStartowy: bez pamięci i wyzwania — FENIKS", () => {
  assert.deepStrictEqual({ ...K.wybierzStartowy(LISTA, {}) }, { id: "FENIKS", zablokowany: false, komunikat: null });
});

test("wybierzStartowy: zapamiętana sprawa wygrywa z domyślną", () => {
  assert.strictEqual(K.wybierzStartowy(LISTA, { zapamietany: "CHLODNIA" }).id, "CHLODNIA");
});

// Review Focus 4
test("wybierzStartowy: zapamiętana sprawa, której już nie ma — FENIKS", () => {
  assert.strictEqual(K.wybierzStartowy(LISTA, { zapamietany: "USUNIETA" }).id, "FENIKS");
});

test("wybierzStartowy: wyzwanie blokuje wybór na swojej sprawie", () => {
  assert.deepStrictEqual({ ...K.wybierzStartowy(LISTA, { zapamietany: "FENIKS", wyzwanie: "WYCIEK" }) },
    { id: "WYCIEK", zablokowany: true, komunikat: null });
});

// Review Focus 5
test("wybierzStartowy: wyzwanie na nieznaną sprawę — komunikat i zwykła gra", () => {
  const r = K.wybierzStartowy(LISTA, { wyzwanie: "Z_PRZYSZLOSCI" });
  assert.strictEqual(r.id, "FENIKS");
  assert.strictEqual(r.zablokowany, false);
  assert.match(r.komunikat, /nie jest dostępna w tej wersji gry/);
});

test("wybierzStartowy: lista bez FENIKSA — pierwsza sprawa", () => {
  assert.strictEqual(K.wybierzStartowy([sp("WYCIEK", "rodo", 3)], {}).id, "WYCIEK");
});

// Review Focus 1
test("rozpoznajMowce: imię z polskim znakiem", () => {
  assert.deepStrictEqual({ ...K.rozpoznajMowce("[Grażyna] Nie wiem, o czym pan mówi.", ["Grażyna", "Kasia"]) },
    { imie: "Grażyna", etykieta: "Grażyna", tekst: "Nie wiem, o czym pan mówi." });
});

// Review Focus 2
test("rozpoznajMowce: imię z nazwiskiem i inna wielkość liter", () => {
  assert.strictEqual(K.rozpoznajMowce("[Grażyna Wójcik] Tak.", ["Grażyna"]).imie, "Grażyna");
  assert.strictEqual(K.rozpoznajMowce("[GRAŻYNA] Tak.", ["Grażyna"]).imie, "Grażyna");
});

test("rozpoznajMowce: nieznany prefiks zostaje etykietą bez postaci", () => {
  assert.deepStrictEqual({ ...K.rozpoznajMowce("[Narrator] Zapada cisza.", ["Grażyna"]) },
    { imie: null, etykieta: "Narrator", tekst: "Zapada cisza." });
});

test("rozpoznajMowce: brak prefiksu", () => {
  assert.deepStrictEqual({ ...K.rozpoznajMowce("Brief od zarządu…", ["Marek"]) },
    { imie: null, etykieta: null, tekst: "Brief od zarządu…" });
});

test("pierwszeZdanie i kropkiPoziomu", () => {
  assert.strictEqual(K.pierwszeZdanie("Firma X upadła. Potem było gorzej."), "Firma X upadła.");
  assert.strictEqual(K.pierwszeZdanie("Bez kropki"), "Bez kropki");
  assert.strictEqual(K.kropkiPoziomu(2), "●●○○○");
});
