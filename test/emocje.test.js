/**
 * Testy modelu napięcia przesłuchania.
 *
 * Gra jest celowo jednym plikiem HTML bez backendu — to jej główna zaleta i nie
 * chcemy jej rozbijać na moduły tylko po to, żeby dało się ją testować. Zamiast
 * tego logika napięcia siedzi w bloku oznaczonym // <emocje> … // </emocje>,
 * a test wycina ten blok i wykonuje w izolacji. Blok jest czysty — żadnego DOM,
 * żadnych zależności — więc wykonanie go poza przeglądarką jest bezpieczne.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const HTML = fs.readFileSync(path.join(__dirname, "..", "sekcja-zwlok.html"), "utf-8");
const blok = HTML.match(/\/\/ <emocje>([\s\S]*?)\/\/ <\/emocje>/);
assert.ok(blok, "nie znaleziono bloku // <emocje> … // </emocje> w sekcja-zwlok.html");

const ctx = vm.createContext({});
vm.runInContext(blok[1] + `
  globalThis.API = { nowyStanEmocji, wykryjKonfrontacje, poPytaniu, napiecieDla,
                     emocjaDla, plikEmocji, EMOCJE_ARC, EMOCJE_PROGI, EMOCJE_WAGI };
`, ctx);
const { nowyStanEmocji, wykryjKonfrontacje, poPytaniu, napiecieDla,
        emocjaDla, plikEmocji, EMOCJE_ARC, EMOCJE_WAGI } = ctx.API;

const MAXQ = 25;
// Pomocnik: seria pytań do jednej postaci, bez zegara (nrPytania=0 w odczycie).
function seria(postac, ile, tekst = "Proszę o szczegóły.") {
  let s = nowyStanEmocji();
  for (let i = 1; i <= ile; i++) s = poPytaniu(s, postac, tekst, i).stan;
  return s;
}

// ---------- wykrywanie konfrontacji ----------
test("konfrontacja: imię innej postaci w pytaniu, także odmienione", () => {
  assert.strictEqual(wykryjKonfrontacje("Tomek pisał do Ciebie o ryzyku.", "Marek"), true);
  assert.strictEqual(wykryjKonfrontacje("A co powiesz na słowa Tomka?", "Marek"), true);
  assert.strictEqual(wykryjKonfrontacje("Wierzysz Beacie?", "Marek"), true);
  assert.strictEqual(wykryjKonfrontacje("Pytałem Iwonę o wymagania.", "Marek"), true);
});

test("konfrontacja: własne imię rozmówcy się nie liczy", () => {
  assert.strictEqual(wykryjKonfrontacje("Marku, dlaczego status był zielony?", "Marek"), false);
  assert.strictEqual(wykryjKonfrontacje("Tomku, ostrzegałeś kogoś?", "Tomek"), false);
});

test("konfrontacja: zwykłe pytanie bez imion to nie konfrontacja", () => {
  assert.strictEqual(wykryjKonfrontacje("Dlaczego status dla zarządu był zielony?", "Marek"), false);
});

// Regresja: \b w JS jest ASCII-only, więc formy kończące się polskim znakiem
// diakrytycznym („Iwonę", „Beatą") przestawały być wykrywane.
test("konfrontacja: formy zakończone znakiem diakrytycznym", () => {
  for (const [zdanie, biezaca] of [
    ["Pytałem Iwonę o wymagania.", "Marek"],
    ["Rozmawiałem z Iwoną wczoraj.", "Tomek"],
    ["Skonfrontuję to z Beatą.", "Marek"],
    ["Beatę pytałem o kontrakt.", "Tomek"],
  ]) assert.strictEqual(wykryjKonfrontacje(zdanie, biezaca), true, zdanie);
});

test("konfrontacja: imię wewnątrz innego wyrazu się nie liczy", () => {
  assert.strictEqual(wykryjKonfrontacje("To był marketingowy bełkot.", "Tomek"), false);
  assert.strictEqual(wykryjKonfrontacje("Sprawdź automarket.", "Marek"), false);
});

// ---------- narastanie i stygnięcie ----------
test("nacisk: kolejne pytania do tej samej osoby podnoszą napięcie", () => {
  const s1 = seria("Marek", 1), s3 = seria("Marek", 3);
  assert.ok(napiecieDla(s3, "Marek", 0, MAXQ) > napiecieDla(s1, "Marek", 0, MAXQ));
  assert.strictEqual(Math.round(napiecieDla(s3, "Marek", 0, MAXQ) * 100) / 100,
    Math.round(3 * EMOCJE_WAGI.nacisk * 100) / 100);
});

test("stygnięcie: pytanie do kogoś innego obniża napięcie pozostałych", () => {
  let s = seria("Marek", 3);
  const przed = napiecieDla(s, "Marek", 0, MAXQ);
  s = poPytaniu(s, "Beata", "A Pani jak to widzi?", 4).stan;
  assert.ok(napiecieDla(s, "Marek", 0, MAXQ) < przed, "Marek powinien ostygnąć");
  assert.strictEqual(Math.round((przed - napiecieDla(s, "Marek", 0, MAXQ)) * 100) / 100,
    EMOCJE_WAGI.ostyganie);
});

test("stygnięcie nie schodzi poniżej zera", () => {
  let s = nowyStanEmocji();
  for (let i = 1; i <= 8; i++) s = poPytaniu(s, "Beata", "Pytanie.", i).stan;
  assert.strictEqual(napiecieDla(s, "Marek", 0, MAXQ), 0);
});

test("konfrontacja podbija napięcie mocniej niż zwykłe pytanie", () => {
  const zwykle = poPytaniu(nowyStanEmocji(), "Marek", "Proszę o szczegóły.", 1);
  const konfr = poPytaniu(nowyStanEmocji(), "Marek", "Tomek pisał do Ciebie o ryzyku.", 1);
  assert.ok(napiecieDla(konfr.stan, "Marek", 0, MAXQ) > napiecieDla(zwykle.stan, "Marek", 0, MAXQ));
  assert.strictEqual(konfr.konfrontacja, true);
  assert.strictEqual(zwykle.konfrontacja, false);
});

test("powrót do porzuconego rozmówcy dokłada bonus tylko po dostatecznej przerwie", () => {
  // Ten sam stan wyjściowy w obu przypadkach — izolujemy sam bonus za powrót.
  const bazowy = { bazowe:{Marek:0.5, Beata:0, Tomek:0, Iwona:0},
                   ostatniIndeks:{Marek:1}, ostatnia:"Tomek" };
  const zLuka  = poPytaniu(bazowy, "Marek", "Pytanie.", 4).stan;   // luka 3 — bonus należny
  const bezLuki = poPytaniu(bazowy, "Marek", "Pytanie.", 3).stan;  // luka 2 — za wcześnie

  assert.strictEqual(Math.round((zLuka.bazowe.Marek - bezLuki.bazowe.Marek) * 100) / 100,
    EMOCJE_WAGI.powrot, "różnica ma być dokładnie wagą powrotu");
});

test("powrót nie nalicza się, gdy pytamy tę samą osobę pod rząd", () => {
  const bazowy = { bazowe:{Marek:0.5, Beata:0, Tomek:0, Iwona:0},
                   ostatniIndeks:{Marek:1}, ostatnia:"Marek" };   // ostatnio też Marek
  const wynik = poPytaniu(bazowy, "Marek", "Pytanie.", 9).stan;   // duża luka, ale bez przerwy
  assert.strictEqual(Math.round((wynik.bazowe.Marek - 0.5) * 100) / 100, EMOCJE_WAGI.nacisk);
});

test("zegar śledztwa podnosi napięcie wszystkim", () => {
  const s = nowyStanEmocji();
  assert.strictEqual(napiecieDla(s, "Marek", 0, MAXQ), 0);
  assert.strictEqual(napiecieDla(s, "Marek", MAXQ, MAXQ), EMOCJE_WAGI.zegar);
  assert.ok(napiecieDla(s, "Marek", 12, MAXQ) > 0 && napiecieDla(s, "Marek", 12, MAXQ) < EMOCJE_WAGI.zegar);
});

test("napięcie nigdy nie przekracza 1", () => {
  let s = nowyStanEmocji();
  for (let i = 1; i <= 40; i++) s = poPytaniu(s, "Tomek", "Beata mówiła co innego.", i).stan;
  assert.strictEqual(napiecieDla(s, "Tomek", MAXQ, MAXQ), 1);
});

// ---------- mapowanie na emocje ----------
test("progi: rosnące napięcie przechodzi kolejne poziomy łuku postaci", () => {
  const arc = EMOCJE_ARC.Marek;
  assert.strictEqual(emocjaDla("Marek", 0.00, false), arc[0]);
  assert.strictEqual(emocjaDla("Marek", 0.29, false), arc[0]);
  assert.strictEqual(emocjaDla("Marek", 0.30, false), arc[1]);
  assert.strictEqual(emocjaDla("Marek", 0.54, false), arc[1]);
  assert.strictEqual(emocjaDla("Marek", 0.55, false), arc[2]);
  assert.strictEqual(emocjaDla("Marek", 0.79, false), arc[2]);
  assert.strictEqual(emocjaDla("Marek", 0.80, false), arc[3]);
  assert.strictEqual(emocjaDla("Marek", 1.00, false), arc[3]);
});

test("każda postać ma własny łuk — ta sama presja daje inną minę", () => {
  const przy = n => Object.keys(EMOCJE_ARC).map(p => emocjaDla(p, n, false));
  assert.deepStrictEqual(przy(0.00), ["neutral", "neutral", "neutral", "neutral"]);
  assert.deepStrictEqual(przy(0.65), ["zaskoczenie", "zaskoczenie", "zlosc", "rezygnacja"]);
  assert.deepStrictEqual(przy(0.95), ["rezygnacja", "zlosc", "rezygnacja", "zlosc"]);
});

test("konfrontacja nadpisuje poziom napięcia na zaskoczenie", () => {
  for (const p of Object.keys(EMOCJE_ARC))
    for (const n of [0, 0.4, 0.9])
      assert.strictEqual(emocjaDla(p, n, true), "zaskoczenie", `${p} przy napięciu ${n}`);
});

test("nieznana postać nie wywraca mapowania", () => {
  assert.strictEqual(emocjaDla("Narrator", 0.9, false), "neutral");
  assert.strictEqual(plikEmocji("Narrator", "zlosc"), null);
});

// ---------- ścieżki plików ----------
test("plikEmocji: neutral wskazuje portret główny, reszta wariant emocji", () => {
  assert.strictEqual(plikEmocji("Marek", "neutral"), "img/marek.png");
  assert.strictEqual(plikEmocji("Iwona", "zlosc"), "img/emocje/iwona-zlosc.jpg");
});

test("każda emocja z każdego łuku ma istniejący plik na dysku", () => {
  const brakujace = [];
  for (const [postac, arc] of Object.entries(EMOCJE_ARC))
    for (const emocja of arc) {
      const p = path.join(__dirname, "..", plikEmocji(postac, emocja));
      if (!fs.existsSync(p)) brakujace.push(plikEmocji(postac, emocja));
    }
  assert.deepStrictEqual(brakujace, [], "brakuje plików grafik dla zadeklarowanych emocji");
});
