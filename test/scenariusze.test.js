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

// ---------- scenariusze w repozytorium ----------
const fs = require("node:fs");
const path = require("node:path");
const GPT = path.join(__dirname, "..", "gpt");

test("repo: każdy gpt/scenariusz-*.md ma poprawne metadane", () => {
  const pliki = fs.readdirSync(GPT).filter(f => /^scenariusz-\d+-.+\.md$/.test(f));
  assert.ok(pliki.length >= 6);
  const metas = [], bledy = [];
  for (const f of pliki) {
    const { meta, tresc } = S.parsujFrontMatter(fs.readFileSync(path.join(GPT, f), "utf-8"));
    bledy.push(...S.walidujScenariusz(meta, tresc, f));
    metas.push(meta);
  }
  bledy.push(...S.walidujKatalog(metas));
  assert.deepStrictEqual(bledy, []);
});

test("repo: FENIKS zachowuje id i obsadę sprzed wielu spraw", () => {
  const { meta } = S.parsujFrontMatter(fs.readFileSync(path.join(GPT, "scenariusz-01-feniks.md"), "utf-8"));
  assert.strictEqual(meta.id, "FENIKS");
  assert.deepStrictEqual(meta.postacie.map(p => [p.imie, p.strategia]),
    [["Marek", "unika"], ["Beata", "czaruje"], ["Tomek", "zgorzknialy"], ["Iwona", "zmeczony"]]);
});

test("repo: silnik gry istnieje i nie zawiera treści FENIKSA", () => {
  const s = fs.readFileSync(path.join(GPT, "silnik-gra.md"), "utf-8");
  assert.match(s, /WYNIK: X\/100/);
  assert.doesNotMatch(s, /Codaris|Logistra|Magnat/);
});

test("repo: master prompt Custom GPT mieści się w limicie 8000 znaków", () => {
  const s = fs.readFileSync(path.join(GPT, "gpt-master-prompt.md"), "utf-8");
  assert.ok(s.length < 8000, `ma ${s.length} znaków`);
});

// ---------- budowanie ----------
const B = require("../scripts/build-scenariusze.js");
const HTML = fs.readFileSync(path.join(__dirname, "..", "sekcja-zwlok.html"), "utf-8");

test("build: blok w HTML jest aktualny (uruchom npm run build)", () => {
  const { lista, bledy } = B.wczytajKatalog();
  assert.deepStrictEqual(bledy, []);
  assert.ok(HTML.includes(B.zbudujBlok(lista, B.wczytajSilnik())),
    "sekcja-zwlok.html ma nieaktualny blok // <scenariusze> — uruchom npm run build");
});

test("build: tekst z </script> nie zamknie tagu skryptu", () => {
  const blok = B.zbudujBlok([{ meta: { id: "X" }, tlo: "", tresc: "zły </script> tekst" }], "silnik");
  assert.ok(!blok.includes("</script>"));
  assert.ok(blok.includes("<\\/script>"));
});

test("build: wstrzyknij podmienia tylko zawartość między znacznikami", () => {
  const html = "a\n  // <scenariusze>\nstare\n  // </scenariusze>\nb";
  assert.strictEqual(B.wstrzyknij(html, "// <scenariusze>\nnowe\n// </scenariusze>"),
    "a\n  // <scenariusze>\nnowe\n// </scenariusze>\nb");
});

test("build: brak znaczników to błąd, nie cicha podmiana", () => {
  assert.throws(() => B.wstrzyknij("bez znaczników", "x"), /znacznik/);
});

test("build: blok wykonuje się jako JS i zawiera FENIKSA z TŁEM", () => {
  const { lista } = B.wczytajKatalog();
  const vm = require("node:vm");
  const ctx = vm.createContext({});
  vm.runInContext(B.zbudujBlok(lista, B.wczytajSilnik()) + "\nglobalThis.W = {SILNIK, SCENARIUSZE};", ctx);
  const feniks = ctx.W.SCENARIUSZE.find(s => s.meta.id === "FENIKS");
  assert.ok(feniks.tlo.startsWith("Projekt FENIKS"));
  assert.ok(!feniks.tresc.startsWith("---"));
  assert.match(ctx.W.SILNIK, /WYNIK: X\/100/);
});
