/**
 * Testy importu grafik: rozpoznawanie luźnych nazw plików i lista slotów.
 * Błąd tutaj nie psuje gry, ale cicho wrzuca portret pod złą nazwę — a gra
 * wtedy po prostu pokazuje inicjały i nikt nie wie dlaczego.
 */
const test = require("node:test");
const assert = require("node:assert");
const { wczytajKatalog } = require("../scripts/build-scenariusze.js");
const { sloty, rozpoznaj } = require("../scripts/importuj-grafiki.js");

const metas = wczytajKatalog().lista.map(s => s.meta);
const cel = n => { const s = rozpoznaj(n, metas); return s && (s.cel || s.blad); };

test("luźne nazwy trafiają do ścieżek, których szuka gra", () => {
  assert.strictEqual(cel("CHŁODNIA - Ryszard.png"), "img/chlodnia/ryszard.png");
  assert.strictEqual(cel("chlodnia_ryszard_złość.png"), "img/chlodnia/emocje/ryszard-zlosc.jpg");
  assert.strictEqual(cel("sezam/Grażyna-surprised.jpg"), "img/sezam/emocje/grazyna-zaskoczenie.jpg");
  assert.strictEqual(cel("wyciek okladka.webp"), "img/wyciek/okladka.jpg");
  assert.strictEqual(cel("wyciek-monika-neutral.png"), "img/wyciek/monika.png");
});

test("FENIKS zostaje w starych ścieżkach", () => {
  assert.strictEqual(cel("feniks-tomek.png"), "img/tomek.png");
  assert.strictEqual(cel("feniks-tomek-smutek.jpg"), "img/emocje/tomek-smutek.jpg");
});

test("niejednoznaczne nazwy są odrzucane z powodem, nie zgadywane", () => {
  assert.match(cel("ryszard.png"), /brak nazwy sprawy/);
  assert.match(cel("chlodnia-ryszard-kuba.png"), /kilka postaci/);
  assert.match(cel("chlodnia-ryszard-zlosc-smutek.png"), /kilka emocji/);
  assert.match(cel("sezam-nieznany.png"), /brak imienia/);
});

test("wymagane emocje = łuk strategii + zaskoczenie", () => {
  const ryszard = sloty(metas).filter(s => s.sprawa === "CHLODNIA" && s.imie === "Ryszard" && s.wymagane);
  assert.deepStrictEqual(ryszard.map(s => s.emocja || s.rodzaj).sort(),
    ["portret", "rezygnacja", "zaskoczenie", "zlosc"]);
});
