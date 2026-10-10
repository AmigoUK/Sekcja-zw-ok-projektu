/**
 * Format scenariuszy: blok metadanych YAML na początku pliku gpt/scenariusz-*.md.
 *
 * Parser obsługuje wyłącznie podzbiór, którego używamy — skalary, listy w nawiasach
 * kwadratowych i jedną listę obiektów (postacie). Pełny YAML to zależność, której
 * nie chcemy dla kilkunastu linii metadanych.
 */
const STRATEGIE = ["unika", "czaruje", "zgorzknialy", "zmeczony", "agresywny"];
const DOMENY = ["projekty", "zywnosc", "rodo"];          // kolejność = kolejność na ekranie
const JURYSDYKCJE = ["PL", "UK", "UE"];
// Formy imion, które są też zwykłymi słowami — dawałyby fałszywe konfrontacje
// („Ani jednego dokumentu?"). Dopisujemy, gdy autor scenariusza trafi na kolejny przypadek.
const SLOWA_POSPOLITE = ["ani"];

// Komentarz zaczyna się od „ #" poza cudzysłowem.
function bezKomentarza(linia) {
  let wCudz = false;
  for (let i = 0; i < linia.length; i++) {
    if (linia[i] === '"') wCudz = !wCudz;
    if (!wCudz && linia[i] === "#" && (i === 0 || /\s/.test(linia[i - 1]))) return linia.slice(0, i);
  }
  return linia;
}

function dzielListe(wnetrze) {
  const wynik = []; let biez = ""; let wCudz = false;
  for (const ch of wnetrze) {
    if (ch === '"') { wCudz = !wCudz; continue; }
    if (ch === "," && !wCudz) { wynik.push(biez.trim()); biez = ""; continue; }
    biez += ch;
  }
  if (biez.trim()) wynik.push(biez.trim());
  return wynik;
}

function wartosc(surowa) {
  const v = surowa.trim();
  if (v.startsWith("[") && v.endsWith("]")) return dzielListe(v.slice(1, -1));
  if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  return v;
}

function parsujFrontMatter(tekst) {
  const t = String(tekst).replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { meta: null, tresc: t };
  const koniec = t.indexOf("\n---", 4);
  if (koniec < 0) return { meta: null, tresc: t };
  const linie = t.slice(4, koniec).split("\n");
  const tresc = t.slice(koniec + 4).replace(/^[^\n]*\n/, "").trim() + "\n";

  const meta = {};
  let lista = null, obiekt = null;
  for (const surowa of linie) {
    const l = bezKomentarza(surowa).replace(/\s+$/, "");
    if (!l.trim()) continue;
    let m;
    if ((m = l.match(/^(\w+):\s*$/))) { lista = meta[m[1]] = []; obiekt = null; continue; }
    if ((m = l.match(/^\s+-\s+(\w+):\s*(.*)$/)) && lista) {
      obiekt = { [m[1]]: wartosc(m[2]) }; lista.push(obiekt); continue;
    }
    if ((m = l.match(/^\s+(\w+):\s*(.*)$/)) && obiekt) { obiekt[m[1]] = wartosc(m[2]); continue; }
    if ((m = l.match(/^(\w+):\s*(.+)$/))) { meta[m[1]] = wartosc(m[2]); lista = obiekt = null; continue; }
  }
  return { meta, tresc };
}

function wyciagnijTlo(tresc) {
  const m = String(tresc).match(/^## TŁO[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  return m ? m[1].trim() : "";
}

function walidujScenariusz(meta, tresc, plik) {
  const e = [];
  const blad = opis => e.push(`${plik}: ${opis}`);
  if (!meta) { blad("brak bloku metadanych (---) na początku pliku"); return e; }

  if (!/^[A-Z0-9_]{1,40}$/.test(String(meta.id || ""))) blad(`id „${meta.id}" — dozwolone A-Z, 0-9, _ (1–40 znaków)`);
  if (!meta.tytul) blad("brak pola tytul");
  if (!DOMENY.includes(meta.domena)) blad(`domena „${meta.domena}" — dozwolone: ${DOMENY.join(", ")}`);
  if (!JURYSDYKCJE.includes(meta.jurysdykcja)) blad(`jurysdykcja „${meta.jurysdykcja}" — dozwolone: ${JURYSDYKCJE.join(", ")}`);
  if (!Number.isInteger(meta.poziom) || meta.poziom < 1 || meta.poziom > 5) blad(`poziom „${meta.poziom}" — liczba 1–5`);
  if (!Number.isInteger(meta.pytania) || meta.pytania < 10 || meta.pytania > 40) blad(`pytania „${meta.pytania}" — liczba 10–40`);

  const postacie = Array.isArray(meta.postacie) ? meta.postacie : [];
  if (postacie.length < 3 || postacie.length > 5) blad(`liczba postaci ${postacie.length} — wymagane 3–5`);

  const wlasciciel = new Map();                 // forma (małe litery) → imię postaci
  const imiona = new Set();
  for (const p of postacie) {
    const kto = p.imie || "?";
    if (p.imie) {
      if (imiona.has(p.imie)) blad(`duplikat imienia „${p.imie}" — obsada i rozpoznawanie mówcy kluczują po imieniu`);
      imiona.add(p.imie);
    }
    for (const pole of ["imie", "nazwisko", "rola"]) if (!p[pole]) blad(`postać ${kto}: brak pola ${pole}`);
    if (!STRATEGIE.includes(p.strategia)) blad(`postać ${kto}: strategia „${p.strategia}" — dozwolone: ${STRATEGIE.join(", ")}`);
    if (!Array.isArray(p.odmiana) || !p.odmiana.length) { blad(`postać ${kto}: brak listy odmiana`); continue; }
    if (p.odmiana[0] !== p.imie) blad(`postać ${kto}: pierwsza forma odmiany musi być mianownikiem (= imie)`);
    for (const f of p.odmiana) {
      const k = f.toLowerCase();
      if (SLOWA_POSPOLITE.includes(k)) blad(`postać ${kto}: forma „${f}" to słowo pospolite — usuń ją z odmiany`);
      if (wlasciciel.has(k) && wlasciciel.get(k) !== kto) blad(`kolizja formy „${f}" między ${wlasciciel.get(k)} a ${kto}`);
      wlasciciel.set(k, kto);
    }
  }

  for (const sekcja of ["## TŁO", "## UKRYTA PRAWDA", "## POSTACIE"])
    if (!String(tresc).includes(sekcja)) blad(`brak sekcji „${sekcja}"`);
  return e;
}

function walidujKatalog(metas) {
  const e = [], widziane = new Set();
  for (const m of metas) {
    if (!m) continue;
    if (widziane.has(m.id)) e.push(`katalog: zduplikowane id ${m.id}`);
    widziane.add(m.id);
  }
  return e;
}

function sortujKatalog(lista) {
  return lista.slice().sort((a, b) =>
    DOMENY.indexOf(a.meta.domena) - DOMENY.indexOf(b.meta.domena) ||
    a.meta.poziom - b.meta.poziom ||
    a.meta.id.localeCompare(b.meta.id));
}

module.exports = {
  parsujFrontMatter, walidujScenariusz, walidujKatalog, wyciagnijTlo, sortujKatalog,
  STRATEGIE, DOMENY, JURYSDYKCJE, SLOWA_POSPOLITE,
};
