/**
 * Testy formatu scenariuszy: parser bloku metadanych i walidator.
 * Scenariusze są danymi, ale błąd w nich psuje grę po cichu (zła odmiana = brak
 * konfrontacji, złe id = rozjechany ranking), więc walidujemy je jak kod.
 */
const test = require("node:test");
const assert = require("node:assert");
const S = require("../scripts/scenariusze.js");

const POPRAWNY = `---
id: TEST_1
tytul: "TEST — sprawa próbna"
domena: zywnosc   # komentarz po wartości
jurysdykcja: PL
poziom: 2
pytania: 25
postacie:
  - imie: Halina
    nazwisko: Sobczak
    rola: "Kierowniczka kuchni"
    strategia: unika
    odmiana: [Halina, Haliny, Halinie, Halinę, Haliną, Halino]
  - imie: Kuba
    nazwisko: Nowicki
    rola: Kucharz
    strategia: zmeczony
    odmiana: [Kuba, Kuby, Kubie, Kubę, Kubą, Kubo]
  - imie: Dorota
    nazwisko: Kmieć
    rola: "Konsultantka HACCP, zewnętrzna"
    strategia: czaruje
    odmiana: [Dorota, Doroty, Dorocie, Dorotę, Dorotą, Doroto]
---
# SCENARIUSZ — próbny

## TŁO (znane graczowi)

Pierwsze zdanie tła. Drugie zdanie.

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [X] coś

## POSTACIE

### 1. Halina
`;

test("parser: skalary, cudzysłowy, komentarze, liczby", () => {
  const { meta } = S.parsujFrontMatter(POPRAWNY);
  assert.strictEqual(meta.id, "TEST_1");
  assert.strictEqual(meta.tytul, "TEST — sprawa próbna");
  assert.strictEqual(meta.domena, "zywnosc");
  assert.strictEqual(meta.poziom, 2);
  assert.strictEqual(meta.pytania, 25);
});

test("parser: lista postaci z listami w nawiasach i przecinkiem w cudzysłowie", () => {
  const { meta } = S.parsujFrontMatter(POPRAWNY);
  assert.strictEqual(meta.postacie.length, 3);
  assert.deepStrictEqual(meta.postacie[0].odmiana, ["Halina", "Haliny", "Halinie", "Halinę", "Haliną", "Halino"]);
  assert.strictEqual(meta.postacie[2].rola, "Konsultantka HACCP, zewnętrzna");
  assert.strictEqual(meta.postacie[1].rola, "Kucharz");
});

test("parser: treść bez bloku metadanych zwraca meta = null", () => {
  const r = S.parsujFrontMatter("# Zwykły plik\n\ntekst");
  assert.strictEqual(r.meta, null);
  assert.strictEqual(r.tresc, "# Zwykły plik\n\ntekst");
});

test("parser: treść zaczyna się za blokiem", () => {
  const { tresc } = S.parsujFrontMatter(POPRAWNY);
  assert.ok(tresc.startsWith("# SCENARIUSZ — próbny"));
});

test("wyciagnijTlo: sekcja TŁO do następnego nagłówka", () => {
  const { tresc } = S.parsujFrontMatter(POPRAWNY);
  assert.strictEqual(S.wyciagnijTlo(tresc), "Pierwsze zdanie tła. Drugie zdanie.");
});

test("walidator: poprawny scenariusz nie ma błędów", () => {
  const { meta, tresc } = S.parsujFrontMatter(POPRAWNY);
  assert.deepStrictEqual(S.walidujScenariusz(meta, tresc, "t.md"), []);
});

function zPodmiana(fn) {
  const { meta, tresc } = S.parsujFrontMatter(POPRAWNY);
  const m = JSON.parse(JSON.stringify(meta));
  fn(m);
  return S.walidujScenariusz(m, tresc, "t.md");
}

test("walidator: brak bloku metadanych", () => {
  assert.match(S.walidujScenariusz(null, "x", "t.md")[0], /t\.md: brak bloku metadanych/);
});

test("walidator: złe id, domena, jurysdykcja, poziom, pytania", () => {
  assert.ok(zPodmiana(m => m.id = "test-1").some(e => /id/.test(e)));
  assert.ok(zPodmiana(m => m.domena = "medycyna").some(e => /domena/.test(e)));
  assert.ok(zPodmiana(m => m.jurysdykcja = "DE").some(e => /jurysdykcja/.test(e)));
  assert.ok(zPodmiana(m => m.poziom = 6).some(e => /poziom/.test(e)));
  assert.ok(zPodmiana(m => m.pytania = "dużo").some(e => /pytania/.test(e)));
});

test("walidator: nieznana strategia", () => {
  assert.ok(zPodmiana(m => m.postacie[0].strategia = "krzyczy").some(e => /strategia/.test(e)));
});

test("walidator: pierwsza forma odmiany musi być imieniem", () => {
  assert.ok(zPodmiana(m => m.postacie[0].odmiana = ["Haliny", "Halina"]).some(e => /mianownik/.test(e)));
});

test("walidator: kolizja form odmiany między postaciami (bez względu na wielkość liter)", () => {
  assert.ok(zPodmiana(m => m.postacie[1].odmiana.push("halinie")).some(e => /koliz/.test(e)));
});

// Review Focus 3: „Ani" to forma imienia Ania i zarazem zwykłe słowo.
test("walidator: forma będąca słowem pospolitym jest odrzucana", () => {
  assert.ok(zPodmiana(m => m.postacie[0].odmiana.push("Ani")).some(e => /pospolit/.test(e)));
});

test("walidator: liczba postaci 3–5", () => {
  assert.ok(zPodmiana(m => m.postacie = m.postacie.slice(0, 2)).some(e => /postaci/.test(e)));
});

test("walidator: wymagane sekcje treści", () => {
  const { meta } = S.parsujFrontMatter(POPRAWNY);
  const bledy = S.walidujScenariusz(meta, "## TŁO\n\nx", "t.md");
  assert.ok(bledy.some(e => /UKRYTA PRAWDA/.test(e)));
  assert.ok(bledy.some(e => /POSTACIE/.test(e)));
});

test("walidujKatalog: duplikat id", () => {
  const { meta } = S.parsujFrontMatter(POPRAWNY);
  assert.ok(S.walidujKatalog([meta, meta]).some(e => /TEST_1/.test(e)));
  assert.deepStrictEqual(S.walidujKatalog([meta]), []);
});

test("sortujKatalog: domena, potem poziom, potem id", () => {
  const l = [
    { meta: { id: "B", domena: "rodo", poziom: 1 } },
    { meta: { id: "C", domena: "projekty", poziom: 3 } },
    { meta: { id: "A", domena: "projekty", poziom: 3 } },
    { meta: { id: "D", domena: "projekty", poziom: 1 } },
  ];
  assert.deepStrictEqual(S.sortujKatalog(l).map(s => s.meta.id), ["D", "A", "C", "B"]);
});
