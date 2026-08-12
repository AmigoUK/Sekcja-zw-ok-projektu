const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// palette
const BG = "121419", PANEL = "1B1F27", PANEL2 = "222733", LINE = "2A2F39";
const INK = "E8E6E1", DIM = "9AA0AB", AMBER = "E6A23C";
const BLUE = "6D8FC0", RED = "C0564F", GREEN = "6FA878", PURPLE = "B08BC9";
const TITLE_F = "Cambria", BODY_F = "Calibri";

const W = 13.33, H = 7.5;

function baseSlide() {
  const s = pres.addSlide();
  s.background = { color: BG };
  return s;
}
function title(s, txt, opts = {}) {
  s.addText(txt, Object.assign({
    x: 0.6, y: 0.42, w: W - 1.2, h: 0.75,
    fontFace: TITLE_F, fontSize: 30, bold: true, color: INK, margin: 0
  }, opts));
}
function av(s, x, y, d, color, initials, fs) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color } });
  s.addText(initials, { x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: BODY_F, fontSize: fs, bold: true, color: "14161A", margin: 0 });
}

/* ---------------- 1. TITLE ---------------- */
(() => {
  const s = baseSlide();
  s.addText("SYMULATOR POST-MORTEM · POZIOM ADVANCED", {
    x: 0.9, y: 1.55, w: 11.5, h: 0.4, fontFace: BODY_F, fontSize: 14,
    color: AMBER, charSpacing: 3, bold: true, margin: 0
  });
  s.addText("Sekcja zwłok projektu", {
    x: 0.9, y: 2.0, w: 11.5, h: 1.3, fontFace: TITLE_F, fontSize: 54, bold: true, color: INK, margin: 0
  });
  s.addText("Gra narracyjna, w której AI odgrywa czterech członków upadłego projektu IT —\na Ty prowadzisz śledztwo, które uczy analizy przyczyn źródłowych i odróżniania faktów od narracji.", {
    x: 0.9, y: 3.35, w: 10.8, h: 0.95, fontFace: BODY_F, fontSize: 16, color: DIM, margin: 0, lineSpacing: 24
  });
  // persona motif
  const defs = [["MZ", BLUE], ["BK", RED], ["TW", GREEN], ["IS", PURPLE]];
  defs.forEach((d, i) => av(s, 0.95 + i * 0.85, 4.75, 0.62, d[1], d[0], 13));
  s.addText("Marek · Beata · Tomek · Iwona — każde z nich ma swoją wersję zdarzeń.", {
    x: 0.95, y: 5.5, w: 9, h: 0.4, fontFace: BODY_F, fontSize: 13, italic: true, color: DIM, margin: 0
  });
  s.addText("Tomasz · narzędzie edukacyjne oparte o LLM", {
    x: 0.9, y: 6.75, w: 9, h: 0.35, fontFace: BODY_F, fontSize: 12, color: DIM, margin: 0
  });
})();

/* ---------------- 2. PROBLEM ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Problem: tej umiejętności nie da się ćwiczyć na sucho");
  s.addText("Analiza przyczyn porażki projektu to jedna z najcenniejszych umiejętności pracy zespołowej. Kursy uczą teorii (5× dlaczego, pytania otwarte, RCA) — ale nie dają rozmówcy, który stawia opór.", {
    x: 0.6, y: 1.3, w: 12.1, h: 0.8, fontFace: BODY_F, fontSize: 15, color: DIM, margin: 0, lineSpacing: 21
  });
  const cards = [
    ["Rzadkie", "Prawdziwe post-mortemy zdarzają się kilka razy w roku — za mało, by zbudować wprawę.", AMBER],
    ["Politycznie napięte", "Uczestnicy chronią siebie i swoje zespoły. Nikt nie ćwiczy na żywych ludziach konfrontowania zeznań.", RED],
    ["Kosztowne w błędach", "Źle poprowadzone post-mortem kończy się polowaniem na winnych — i zamyka ludzi na przyszłość.", BLUE],
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.45, w: 3.85, h: 2.5, rectRadius: 0.09,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    av(s, x + 0.3, 2.75, 0.5, c[2], String(i + 1), 14);
    s.addText(c[0], { x: x + 0.3, y: 3.45, w: 3.3, h: 0.4, fontFace: TITLE_F, fontSize: 18, bold: true, color: INK, margin: 0 });
    s.addText(c[1], { x: x + 0.3, y: 3.9, w: 3.25, h: 1.0, fontFace: BODY_F, fontSize: 12.5, color: DIM, margin: 0, lineSpacing: 17 });
  });
  s.addText([
    { text: "Odpowiedź: ", options: { bold: true, color: AMBER } },
    { text: "AI nie jest tu wykładowcą, tylko przeciwnikiem — zespołem, który trzeba umiejętnie przesłuchać. Wiedza gracza jest weryfikowana przez działanie, nie przez test.", options: { color: INK } },
  ], { x: 0.6, y: 5.55, w: 12.1, h: 0.9, fontFace: BODY_F, fontSize: 16, margin: 0, lineSpacing: 23 });
})();

/* ---------------- 3. SPRAWA FENIKS ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Akta sprawy: Projekt FENIKS");
  s.addText("Software house Codaris wdrażał system ERP dla dystrybutora Logistra. Zarząd wynajmuje gracza jako facylitatora post-mortem: ma ustalić, co naprawdę poszło nie tak.", {
    x: 0.6, y: 1.3, w: 12.1, h: 0.75, fontFace: BODY_F, fontSize: 15, color: DIM, margin: 0, lineSpacing: 21
  });
  const stats = [
    ["6 → 14", "miesięcy trwał projekt\n(plan → rzeczywistość)"],
    ["2,1 mln", "zł wydane\nz budżetu 900 tys."],
    ["0", "wdrożeń na produkcję —\numowa zerwana"],
    ["25", "pytań ma gracz,\nby ustalić przyczyny"],
  ];
  stats.forEach((c, i) => {
    const x = 0.6 + i * 3.13;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.35, w: 2.87, h: 2.15, rectRadius: 0.09,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(c[0], { x: x + 0.15, y: 2.6, w: 2.57, h: 0.85, align: "center", fontFace: TITLE_F,
      fontSize: i === 1 ? 34 : 38, bold: true, color: AMBER, margin: 0 });
    s.addText(c[1], { x: x + 0.15, y: 3.55, w: 2.57, h: 0.8, align: "center", fontFace: BODY_F,
      fontSize: 12, color: DIM, margin: 0, lineSpacing: 15 });
  });
  s.addText([
    { text: "Gracz zna tylko te fakty. ", options: { color: INK, bold: true } },
    { text: "Pięć rzeczywistych przyczyn źródłowych — od ukrytej obietnicy przedsprzedażowej po zmianę sponsora u klienta — jest zapisanych wyłącznie w instrukcji systemowej AI. Trzeba je wydobyć z ludzi.", options: { color: DIM } },
  ], { x: 0.6, y: 5.1, w: 12.1, h: 1.0, fontFace: BODY_F, fontSize: 15, margin: 0, lineSpacing: 22 });
})();

/* ---------------- 4. POSTACIE ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Czworo świadków, cztery wersje zdarzeń");
  const ppl = [
    ["MZ", BLUE, "Marek Zawada", "Project Manager, Codaris",
      "„Klient ciągle zmieniał wymagania.”",
      "Zmiany zakresu bez aneksów i zielone statusy, gdy projekt płonął."],
    ["BK", RED, "Beata Krajewska", "Account Manager, Codaris",
      "„Sprzedaż dowiozła, delivery nie udźwignęło.”",
      "Mailową obietnicę integracji „w cenie” — złożoną przed umową, bez wiedzy techników."],
    ["TW", GREEN, "Tomek Wilk", "Tech Lead, Codaris",
      "„Wszystko przez Magnata. Ostrzegałem.”",
      "Własne zaniżone estymaty i to, że po zignorowanym mailu przestał eskalować."],
    ["IS", PURPLE, "Iwona Stachura", "PM klienta, Logistra",
      "„Codaris obiecywał i nie dowoził.”",
      "Zmianę sponsora i paraliż decyzyjny po stronie Logistry."],
  ];
  ppl.forEach((p, i) => {
    const x = 0.6 + (i % 2) * 6.25, y = 1.45 + Math.floor(i / 2) * 2.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.9, h: 2.5, rectRadius: 0.09,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    av(s, x + 0.3, y + 0.3, 0.65, p[1], p[0], 14);
    s.addText(p[2], { x: x + 1.15, y: y + 0.28, w: 4.5, h: 0.4, fontFace: TITLE_F, fontSize: 17, bold: true, color: INK, margin: 0 });
    s.addText(p[3], { x: x + 1.15, y: y + 0.66, w: 4.5, h: 0.3, fontFace: BODY_F, fontSize: 11.5, color: DIM, margin: 0 });
    s.addText([
      { text: "Narracja:  ", options: { bold: true, color: AMBER } },
      { text: p[4], options: { color: INK, italic: true } },
    ], { x: x + 0.3, y: y + 1.12, w: 5.35, h: 0.45, fontFace: BODY_F, fontSize: 12.5, margin: 0, lineSpacing: 16 });
    s.addText([
      { text: "Ukrywa:  ", options: { bold: true, color: RED } },
      { text: p[5], options: { color: DIM } },
    ], { x: x + 0.3, y: y + 1.6, w: 5.35, h: 0.8, fontFace: BODY_F, fontSize: 12.5, margin: 0, lineSpacing: 16 });
  });
  s.addText("Każda postać w czymś kłamie i w czymś ma rację — jak w prawdziwym post-mortem.", {
    x: 0.6, y: 6.95, w: 12.1, h: 0.35, fontFace: BODY_F, fontSize: 13, italic: true, color: DIM, margin: 0
  });
})();

/* ---------------- 5. MECHANIKA ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Mechanika: śledztwo → raport → debrief");
  const phases = [
    ["1 · ŚLEDZTWO", "Przesłuchujesz postacie, przełączając się między nimi. Budżet 25 pytań wymusza strategię. Fakty wychodzą tylko po dobrym pytaniu otwartym, prośbie o dokument lub konfrontacji.", AMBER],
    ["2 · RAPORT", "Piszesz raport post-mortem: przyczyny źródłowe, rozdzielenie skutków od przyczyn, trzy rekomendacje na przyszłość.", BLUE],
    ["3 · DEBRIEF", "AI wychodzi z roli: punktacja względem ukrytej prawdy, wskazanie fałszywych tropów, które kupiłeś — i pytań, których zabrakło.", GREEN],
  ];
  phases.forEach((p, i) => {
    const x = 0.6 + i * 4.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 3.85, h: 2.6, rectRadius: 0.09,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(p[0], { x: x + 0.3, y: 1.75, w: 3.3, h: 0.4, fontFace: BODY_F, fontSize: 15, bold: true, color: p[2], charSpacing: 1.5, margin: 0 });
    s.addText(p[1], { x: x + 0.3, y: 2.25, w: 3.3, h: 1.7, fontFace: BODY_F, fontSize: 12.5, color: DIM, margin: 0, lineSpacing: 17 });
    if (i < 2) s.addText("→", { x: x + 3.85, y: 2.45, w: 0.5, h: 0.6, align: "center", fontSize: 24, color: DIM, margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.5, w: 12.1, h: 2.35, rectRadius: 0.09,
    fill: { color: PANEL2 }, line: { color: AMBER, width: 1 } });
  s.addText([
    { text: "Silnik zaangażowania: konfrontacja krzyżowa\n", options: { bold: true, color: AMBER, fontSize: 16 } },
    { text: "Zeznanie jednej postaci jest amunicją na inną. Tomek ujawnia zignorowany e-mail ostrzegawczy → to łamie Marka i jego zielone statusy. Iwona wspomina integrację „obiecaną w cenie” → to łamie Beatę. Gra staje się detektywistyczną układanką: wiedza z jednej rozmowy otwiera drzwi w kolejnej.", options: { color: INK, fontSize: 14 } },
  ], { x: 0.95, y: 4.8, w: 11.4, h: 1.8, fontFace: BODY_F, margin: 0, lineSpacing: 21 });
})();

/* ---------------- 6. SCREENSHOT ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Rozgrywka: konfrontacja krzyżowa w akcji");
  const iw = 9.4, ih = iw * 860 / 1400;
  s.addImage({ path: "game-staged.png", x: 0.6, y: 1.35, w: iw, h: ih });
  const notes = [
    ["Licznik pytań", "Zasób jest ograniczony — każde pytanie musi mieć cel.", AMBER],
    ["Dowód od Tomka", "E-mail ostrzegawczy z 2. miesiąca — amunicja na PM-a.", GREEN],
    ["Konfrontacja", "Zacytowany dowód łamie narrację Marka: przyznaje się do „zielonych” statusów.", BLUE],
  ];
  notes.forEach((n, i) => {
    const y = 1.5 + i * 1.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.25, y, w: 2.5, h: 1.6, rectRadius: 0.07,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(n[0], { x: 10.45, y: y + 0.15, w: 2.1, h: 0.3, fontFace: BODY_F, fontSize: 12, bold: true, color: n[2], margin: 0 });
    s.addText(n[1], { x: 10.45, y: y + 0.48, w: 2.12, h: 1.05, fontFace: BODY_F, fontSize: 10.5, color: DIM, margin: 0, lineSpacing: 14 });
  });
  s.addText("Prototyp: pojedynczy plik HTML, klucz API użytkownika (Anthropic / OpenAI), zero backendu.", {
    x: 0.6, y: 7.05, w: 12.1, h: 0.35, fontFace: BODY_F, fontSize: 12, italic: true, color: DIM, margin: 0
  });
})();

/* ---------------- 7. SERCE NARZĘDZIA ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Serce narzędzia: anatomia system promptu");
  const blocks = [
    ["Ukryta prawda", "5 przyczyn źródłowych + 3 fałszywe tropy zapisane wprost w prompcie. Ocena końcowa nie jest uznaniowa — AI porównuje raport z zamkniętą listą faktów.", AMBER],
    ["Warunki odblokowania", "Każda postać ma zapisane, co ukrywa i jakie zachowanie gracza to ujawnia. Nagrodą za dobre pytanie jest fakt — nie pochwała. Dydaktyka siedzi w mechanice.", GREEN],
    ["Częściowa racja", "Każda postać w czymś kłamie i w czymś ma rację; kłamie przez pomijanie. Uczy najtrudniejszego: nie „kto kłamie”, lecz „która część czyjej wersji jest prawdą”.", BLUE],
  ];
  blocks.forEach((b, i) => {
    const y = 1.4 + i * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 5.9, h: 1.4, rectRadius: 0.08,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(b[0], { x: 0.9, y: y + 0.12, w: 5.3, h: 0.35, fontFace: TITLE_F, fontSize: 15, bold: true, color: b[2], margin: 0 });
    s.addText(b[1], { x: 0.9, y: y + 0.48, w: 5.35, h: 0.85, fontFace: BODY_F, fontSize: 11.5, color: DIM, margin: 0, lineSpacing: 15 });
  });
  // prompt excerpt
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.4, w: 5.9, h: 4.6, rectRadius: 0.08,
    fill: { color: "0C0E12" }, line: { color: AMBER, width: 1 } });
  s.addText("fragment instrukcji systemowej", { x: 7.15, y: 1.58, w: 5.3, h: 0.3, fontFace: BODY_F, fontSize: 10.5, color: AMBER, charSpacing: 2, margin: 0 });
  s.addText(
"### Beata Krajewska — Account Manager\n" +
"Ukrywa: przyczynę 1 (mail z obietnicą\nintegracji „w cenie”).\n" +
"Warunki odblokowania: przyznaje się TYLKO,\ngdy gracz zapyta o różnice między ofertą\na umową LUB skonfrontuje ją z zeznaniem\nIwony. Najpierw bagatelizuje („to była\ndeklaracja intencji”), przyciśnięta\nprzyznaje fakty.\n" +
"Częściowo ma rację: kontrakt sam w sobie\nbył rentowny — gdyby nie ukryta obietnica.",
    { x: 7.15, y: 1.95, w: 5.35, h: 3.9, fontFace: "Courier New", fontSize: 10.5, color: INK, margin: 0, lineSpacing: 14.5 });
  s.addText("Reguła nadrzędna: pytania ogólne dostają narrację, pytania o konkrety (dokumenty, daty, decyzje) — przybliżają do prawdy. Zakaz metakomentarzy w trakcie gry: cała dydaktyka żyje w debriefie.", {
    x: 0.6, y: 6.25, w: 12.1, h: 0.85, fontFace: BODY_F, fontSize: 13.5, color: INK, margin: 0, lineSpacing: 19
  });
})();

/* ---------------- 8. ANALIZA WARTOŚCI ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Analiza wartości: czego uczy i jak to sprawdza");
  // left: goals
  s.addText("Cele nauki (obserwowalne)", { x: 0.6, y: 1.35, w: 5.8, h: 0.4, fontFace: TITLE_F, fontSize: 17, bold: true, color: AMBER, margin: 0 });
  const goals = [
    "Pytania otwarte i dopytywanie o fakty — dokumenty, daty, decyzje — zamiast przyjmowania interpretacji.",
    "Drążenie łańcuchów „dlaczego → dlaczego” aż do przyczyny systemowej, nie personalnej.",
    "Rozpoznawanie, że spójna, chętnie opowiadana historia to często zasłona.",
    "Konfrontacja bez agresji — postać klientki usztywnia się przy tonie oskarżycielskim.",
  ];
  s.addText(goals.map((g, i) => ({ text: g, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })),
    { x: 0.65, y: 1.85, w: 5.75, h: 3.4, fontFace: BODY_F, fontSize: 13, color: INK, lineSpacing: 18 });
  // right: verification
  s.addText("Weryfikacja wiedzy — trzy niezależne pomiary", { x: 6.9, y: 1.35, w: 5.8, h: 0.4, fontFace: TITLE_F, fontSize: 17, bold: true, color: GREEN, margin: 0 });
  const ver = [
    ["W trakcie gry · behawioralnie", "Złe pytania nie zdobywają faktów. Symulatora nie da się „przegadać” — można go tylko dobrze przesłuchać."],
    ["Raport · rubryka 60 / 20 / 20", "60 pkt: przyczyny źródłowe (nie objawy) · 20 pkt: odrzucone fałszywe tropy · 20 pkt: rekomendacje adresujące przyczyny."],
    ["Debrief · metapoznawczo", "AI pokazuje, czego NIE odkryłeś i jakie pytanie by to odblokowało — konkretna luka w technice i powód do ponownej gry."],
  ];
  ver.forEach((v, i) => {
    const y = 1.9 + i * 1.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.9, y, w: 5.85, h: 1.27, rectRadius: 0.08,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(v[0], { x: 7.15, y: y + 0.1, w: 5.35, h: 0.32, fontFace: BODY_F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addText(v[1], { x: 7.15, y: y + 0.44, w: 5.4, h: 0.78, fontFace: BODY_F, fontSize: 11, color: DIM, margin: 0, lineSpacing: 15 });
  });
  s.addText([
    { text: "Miara sukcesu narzędzia: ", options: { bold: true, color: AMBER } },
    { text: "różnica wyników między 1. a 3. rozgrywką tego samego gracza na innym scenariuszu — rośnie technika, nie znajomość odpowiedzi.", options: { color: INK } },
  ], { x: 0.6, y: 6.35, w: 12.1, h: 0.75, fontFace: BODY_F, fontSize: 14, margin: 0, lineSpacing: 20 });
})();

/* ---------------- 9. ITERACJE ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Wnioski z iteracji: cztery wersje, cztery lekcje");
  const rows = [
    ["v1", "Zbyt usłużny świadek", "Postacie przyznawały się po dwóch ogólnych pytaniach — gra kończyła się w 5 minut.", "Jawne warunki odblokowania („przyznaje się TYLKO gdy…”); pytania ogólne dostają narrację, nie fakty.", RED],
    ["v2", "Karykatury zamiast ludzi", "Po usztywnieniu reguł wszyscy kłamali we wszystkim — frustrująca, nieuczciwa rozgrywka.", "Sekcja „częściowo ma rację” + kłamstwo przez pomijanie. Doszedł też limit 25 pytań — wymusza strategię.", AMBER],
    ["v3", "Wykład zamiast gry", "Model wtrącał metakomentarze („zauważ, że to pytanie zamknięte…”) — zabijał immersję, nudził.", "Twardy zakaz wychodzenia z roli; cała dydaktyka przeniesiona do debriefu, do konkretnej rozgrywki gracza.", BLUE],
    ["v4", "Ocena z sufitu", "Debrief bywał miękki i uznaniowy („całkiem nieźle Ci poszło!”).", "Sztywna rubryka 60/20/20 + obowiązkowe „czego nie odkryłeś i jakie pytanie by to odblokowało”.", GREEN],
  ];
  rows.forEach((r, i) => {
    const y = 1.4 + i * 1.38;
    av(s, 0.6, y + 0.28, 0.55, r[4], r[0], 12);
    s.addText(r[1], { x: 1.4, y: y + 0.02, w: 3.1, h: 1.1, fontFace: TITLE_F, fontSize: 15.5, bold: true, color: INK, margin: 0, valign: "middle", lineSpacing: 18 });
    s.addText([{ text: "Problem: ", options: { bold: true, color: r[4] } }, { text: r[2], options: { color: DIM } }],
      { x: 4.6, y: y, w: 4.0, h: 1.2, fontFace: BODY_F, fontSize: 11.5, margin: 0, lineSpacing: 15, valign: "top" });
    s.addText([{ text: "Zmiana: ", options: { bold: true, color: INK } }, { text: r[3], options: { color: DIM } }],
      { x: 8.8, y: y, w: 3.95, h: 1.2, fontFace: BODY_F, fontSize: 11.5, margin: 0, lineSpacing: 15, valign: "top" });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: 1.4, y: y + 1.26, w: 11.3, h: 0, line: { color: LINE, width: 0.75 } });
  });
  s.addText("Najtańszym narzędziem dydaktycznym okazało się ograniczenie zasobu: limit pytań wymusza refleksję przed pytaniem.", {
    x: 0.6, y: 7.0, w: 12.1, h: 0.35, fontFace: BODY_F, fontSize: 12.5, italic: true, color: DIM, margin: 0
  });
})();

/* ---------------- 10. PODSUMOWANIE ---------------- */
(() => {
  const s = baseSlide();
  title(s, "Co dalej: skalowalność i demo");
  s.addText([
    { text: "„AI nie jest wykładowcą, tylko przeciwnikiem —\na wiedza gracza jest weryfikowana przez działanie, nie przez test.”", options: { italic: true, color: INK } },
  ], { x: 0.6, y: 1.35, w: 12.1, h: 0.95, fontFace: TITLE_F, fontSize: 20, margin: 0, lineSpacing: 28 });
  const cards = [
    ["Skalowalność", "Nowy scenariusz = wymiana „ukrytej prawdy” i kart postaci; mechanika, komendy i rubryka zostają. Naturalne rozszerzenia: upadły startup, kryzys wizerunkowy, incydent bezpieczeństwa.", AMBER],
    ["Dwie formy narzędzia", "System prompt działa samodzielnie po wklejeniu do ChatGPT / Claude (komendy START · ROZMOWA · RAPORT · DEBRIEF). Prototyp HTML dodaje interfejs śledczego i licznik pytań.", BLUE],
    ["Plan screencastu (3–4 min)", "Ekran startowy → rozmowa i konfrontacja krzyżowa → fragment promptu → debrief z punktacją → 4 iteracje po jednym zdaniu.", GREEN],
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.6, w: 3.85, h: 3.1, rectRadius: 0.09,
      fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(c[0], { x: x + 0.3, y: 2.85, w: 3.3, h: 0.6, fontFace: TITLE_F, fontSize: 16, bold: true, color: c[2], margin: 0, lineSpacing: 19 });
    s.addText(c[1], { x: x + 0.3, y: 3.5, w: 3.28, h: 2.05, fontFace: BODY_F, fontSize: 12, color: DIM, margin: 0, lineSpacing: 16.5 });
  });
  const defs = [["MZ", BLUE], ["BK", RED], ["TW", GREEN], ["IS", PURPLE]];
  defs.forEach((d, i) => av(s, 0.65 + i * 0.7, 6.25, 0.5, d[1], d[0], 11));
  s.addText("Dziękuję — zapraszam na przesłuchanie.", {
    x: 3.7, y: 6.32, w: 9, h: 0.4, fontFace: BODY_F, fontSize: 14, italic: true, color: DIM, margin: 0
  });
})();

pres.writeFile({ fileName: "sekcja-zwlok-prezentacja.pptx" }).then(() => console.log("OK"));
