# Changelog

All notable changes to **Sekcja zwłok projektu** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [1.2.1] — 2026-10-10

### Security
- `nodemailer` 9.1.1 → 10.0.16 (serwer rankingu): poprawki DoS w parserze adresów i obejść walidacji domen odbiorcy (GHSA-v53p-9fqp-m79j, GHSA-2x7j-588g-ccc2 i in.).
- `express` 4.22.3 z `proxy-addr` 2.0.8 (podszywanie się pod IP przez adresy IPv4-mapped IPv6, GHSA-jqcg-44mw-7w3h) i `qs` 6.16.0 (DoS, obejście limitu tablic).

### Changed
- Wymagany Node.js ≥ 22.5 (`engines`) — serwer i tak korzysta z wbudowanego `node:sqlite`, a `nodemailer` 10 wymaga Node 20+.

## [1.2.0] — 2026-10-10

### Added
- Trzy nowe sprawy szkoleniowe: ROZSYŁKA (🇬🇧 RODO, poziom 1 — arkusz zwolnień lekarskich wysłany do całej firmy), LISTERIA (🇵🇱 żywność, poziom 4 — wycofanie parówek z zakładu mięsnego, kryteria L. monocytogenes po nowelizacji 2024/2895), KUPON (🇵🇱 RODO, poziom 4 — aplikacja lojalnościowa sieci pizzerii, alergie jako dane o zdrowiu, powierzenie i wyciek przez API).
- Prompty grafik dla 11 nowych postaci w `prompty-grafiki-scenariusze.md`.
- `npm run grafiki -- <katalog>` — import grafik postaci z luźno nazwanych plików (np. „CHŁODNIA - Ryszard - złość.png”): rozpoznanie sprawy, postaci i emocji, przycięcie i skalowanie do formatów gry; `--stan` pokazuje brakujące wymagane grafiki.

## [1.1.0] — 2026-10-10

### Added
- Biblioteka spraw: wybór scenariusza na ekranie startowym, pogrupowany według domen (projekty, bezpieczeństwo żywności, dane i RODO).
- Trzy scenariusze branżowe: CHŁODNIA (🇵🇱 zatrucie w cateringu), SEZAM (🇬🇧 alergen w kanapce PPDS), WYCIEK (🇵🇱 naruszenie ochrony danych).
- W grze dostępne także scenariusze BILBORD, NOVA, BLACKOUT, PRZEJĘCIE i KONSORCJUM, dotąd tylko w pakiecie Custom GPT.
- „Lekcja branżowa” w debriefie: zasada i jej źródło przy każdej przyczynie (bez wpływu na punktację).
- Ranking z podziałem na sprawy (`GET /api/leaderboard?scenario=ID`).
- `npm run build` — scenariusze z `gpt/*.md` wstrzykiwane do gry; walidacja metadanych w testach.
- Prompty grafik dla postaci nowych spraw (`prompty-grafiki-scenariusze.md`).

### Changed
- Mimika postaci wynika ze strategii obronnej zadeklarowanej w scenariuszu, a konfrontacja jest wykrywana po formach odmiany z metadanych.
- Pojedynek blokuje wybór sprawy na scenariuszu z wyzwania.

### Fixed
- Rozpoznawanie mówcy, gdy imię postaci zawiera polskie znaki (np. „[Grażyna]”).
- Etykieta mówcy jest escapowana przy wyświetlaniu.

## [1.0.0] — 2026-08-12

### Added
- Gra „Sekcja zwłok projektu” ze scenariuszem FENIKS, wieloma silnikami AI i rankingiem z autoryzacją mailową.
- Pojedynki: wyzwanie znajomego na pobicie wyniku.
- Emocje rozmówców w przestrzeni czatu.
- Opcjonalne zapamiętywanie klucza API w pamięci sesyjnej karty.
- Ranking na SQLite: trwałe kody, bilety i limity.

[Unreleased]: https://github.com/AmigoUK/Sekcja-zw-ok-projektu/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/AmigoUK/Sekcja-zw-ok-projektu/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/AmigoUK/Sekcja-zw-ok-projektu/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/AmigoUK/Sekcja-zw-ok-projektu/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/AmigoUK/Sekcja-zw-ok-projektu/releases/tag/v1.0.0
