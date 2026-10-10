#!/usr/bin/env node
/**
 * Import grafik postaci wygenerowanych poza repo (Midjourney, ChatGPT…).
 *
 *   node scripts/importuj-grafiki.js <katalog>   — rozpoznaje pliki, przycina, skaluje, zapisuje do img/
 *   node scripts/importuj-grafiki.js --stan      — pokazuje, których grafik jeszcze brakuje
 *
 * Nazwy plików wejściowych są luźne: „CHŁODNIA - Ryszard - złość.png", „chlodnia_ryszard.png"
 * i „chlodnia/ryszard-anger.jpg" trafią w to samo miejsce. Liczy się sprawa, imię i
 * (opcjonalnie) emocja albo słowo „okladka". Docelowe ścieżki i rozmiary są te, które gra
 * wczytuje (zbudujObsade/plikEmocji w sekcja-zwlok.html) — skrypt nie zmienia gry, tylko
 * dostarcza pliki tam, gdzie gra już ich szuka. Skalowanie: ImageMagick (`convert`).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { wczytajKatalog } = require("./build-scenariusze.js");

const ROOT = path.join(__dirname, "..");

// Ścieżki i łuki emocji bierzemy z samej gry (blok // <emocje>, jak test/emocje.test.js),
// żeby import nie rozjechał się z tym, czego gra faktycznie szuka.
const HTML = fs.readFileSync(path.join(ROOT, "sekcja-zwlok.html"), "utf-8");
const ctx = vm.createContext({});
vm.runInContext(HTML.match(/\/\/ <emocje>([\s\S]*?)\/\/ <\/emocje>/)[1] +
  "\nglobalThis.API = { zbudujObsade, plikEmocji, slug, EMOCJE_LUKI };", ctx);
const { zbudujObsade, plikEmocji, slug } = ctx.API;
const EMOCJE = ["radosc", "zlosc", "zaskoczenie", "smutek", "rezygnacja"];

// Słowa, którymi ludzie podpisują warianty — po polsku i po angielsku (generatory mówią EN).
const ALIASY = {
  portret: null, neutral: null, neutralny: null, neutralna: null, base: null,
  radosc: "radosc", joy: "radosc", happy: "radosc", smile: "radosc",
  zlosc: "zlosc", anger: "zlosc", angry: "zlosc",
  zaskoczenie: "zaskoczenie", surprise: "zaskoczenie", surprised: "zaskoczenie",
  smutek: "smutek", sad: "smutek", sadness: "smutek",
  rezygnacja: "rezygnacja", resigned: "rezygnacja", resignation: "rezygnacja",
};

/** Lista wszystkich slotów graficznych katalogu spraw, z flagą „wymagane". */
function sloty(metas) {
  const wynik = [];
  for (const m of metas) {
    const obsada = zbudujObsade(m);
    wynik.push({ sprawa: m.id, rodzaj: "okladka", cel: `${obsada.katalog}okladka.jpg`, wymagane: false });
    for (const [imie, p] of Object.entries(obsada.postacie)) {
      // Gra pokazuje emocje z łuku strategii plus „zaskoczenie" przy każdej konfrontacji.
      const potrzebne = new Set([...p.luk, "zaskoczenie"]);
      wynik.push({ sprawa: m.id, imie, rodzaj: "portret", cel: plikEmocji(obsada, imie, "neutral"), wymagane: true });
      for (const e of EMOCJE) {
        wynik.push({ sprawa: m.id, imie, rodzaj: "emocja", emocja: e,
          cel: plikEmocji(obsada, imie, e), wymagane: potrzebne.has(e) });
      }
    }
  }
  return wynik;
}

/**
 * Dopasowuje ścieżkę pliku (względną wobec katalogu importu) do slotu.
 * Zwraca slot albo { blad } z powodem — nic nie zgadujemy po cichu.
 */
function rozpoznaj(sciezka, metas, wszystkieSloty = sloty(metas)) {
  const bezRozszerzenia = sciezka.replace(/\.[^./\\]+$/, "");
  const tokeny = slug(bezRozszerzenia).split("-").filter(Boolean);
  const sprawy = metas.filter(m => tokeny.includes(slug(m.id)));
  if (sprawy.length !== 1) return { blad: sprawy.length ? "kilka spraw w nazwie" : "brak nazwy sprawy" };
  const m = sprawy[0];
  if (tokeny.includes("okladka") || tokeny.includes("cover")) {
    return wszystkieSloty.find(s => s.sprawa === m.id && s.rodzaj === "okladka");
  }
  const postacie = m.postacie.filter(p => tokeny.includes(slug(p.imie)));
  if (postacie.length !== 1) return { blad: postacie.length ? "kilka postaci w nazwie" : `brak imienia postaci z ${m.id}` };
  const emocje = [...new Set(tokeny.filter(t => t in ALIASY).map(t => ALIASY[t]).filter(Boolean))];
  if (emocje.length > 1) return { blad: "kilka emocji w nazwie" };
  const imie = postacie[0].imie;
  return wszystkieSloty.find(s => s.sprawa === m.id && s.imie === imie &&
    (emocje.length ? s.emocja === emocje[0] : s.rodzaj === "portret"));
}

// Rozmiary jak w istniejących grafikach FENIKSA (img/beata.png, img/emocje/*, img/okladka.jpg).
const FORMAT = {
  portret: ["-resize", "384x384^", "-gravity", "center", "-extent", "384x384"],
  emocja:  ["-resize", "768x768^", "-gravity", "center", "-extent", "768x768", "-quality", "88"],
  okladka: ["-resize", "682x1024^", "-gravity", "center", "-extent", "682x1024", "-quality", "88"],
};

function pliki(dir, baza = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return pliki(p, baza);
    return /\.(png|jpe?g|webp)$/i.test(d.name) ? [path.relative(baza, p)] : [];
  });
}

function importuj(dir, metas) {
  const wszystkie = sloty(metas);
  const zajete = new Map();
  let ok = 0;
  for (const rel of pliki(dir).sort()) {
    const slot = rozpoznaj(rel, metas, wszystkie);
    if (!slot || slot.blad) { console.log(`  ?  ${rel} — ${slot ? slot.blad : "nie pasuje do żadnego slotu"}`); continue; }
    if (zajete.has(slot.cel)) { console.log(`  !  ${rel} — ten sam slot co ${zajete.get(slot.cel)}, pomijam`); continue; }
    zajete.set(slot.cel, rel);
    const cel = path.join(ROOT, slot.cel);
    const nadpis = fs.existsSync(cel) ? " (nadpisano)" : "";
    fs.mkdirSync(path.dirname(cel), { recursive: true });
    execFileSync("convert", [path.join(dir, rel), "-auto-orient", "-strip", ...FORMAT[slot.rodzaj], cel]);
    console.log(`  ✓  ${rel} → ${slot.cel}${nadpis}`);
    ok++;
  }
  console.log(`\nZaimportowano ${ok} plików.\n`);
}

function stan(metas) {
  let brakWymaganych = 0;
  for (const m of metas) {
    const s = sloty([m]);
    const brak = s.filter(x => x.wymagane && !fs.existsSync(path.join(ROOT, x.cel)));
    const jest = s.filter(x => fs.existsSync(path.join(ROOT, x.cel))).length;
    brakWymaganych += brak.length;
    console.log(`${m.id.padEnd(11)} ${String(jest).padStart(2)}/${s.length} plików` +
      (brak.length ? ` — brak wymaganych: ${brak.map(x => path.basename(x.cel)).join(", ")}` : " — komplet wymaganych"));
  }
  return brakWymaganych;
}

if (require.main === module) {
  const { lista, bledy } = wczytajKatalog();
  if (bledy.length) { console.error(bledy.join("\n")); process.exit(1); }
  const metas = lista.map(s => s.meta);
  const arg = process.argv[2];
  if (!arg || arg === "--stan") {
    if (!arg) console.log("Użycie: npm run grafiki -- <katalog z grafikami>   |   npm run grafiki -- --stan\n");
    stan(metas);
  } else {
    if (!fs.existsSync(arg) || !fs.statSync(arg).isDirectory()) { console.error(`Brak katalogu: ${arg}`); process.exit(1); }
    importuj(path.resolve(arg), metas);
    stan(metas);
  }
}

module.exports = { slug, sloty, rozpoznaj };
