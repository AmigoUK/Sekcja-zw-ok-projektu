# Plan wdrożenia zaległego backlogu

Data: 2026-08-12 · Tryb pracy: kod → testy zielone → commit → push → następny

Trzy niezależne projekty. Żadna para nie dzieli pliku, więc kolejność wynika z tego, co odblokowuje pracę, a nie z rozmiaru.

## Kolejność i uzasadnienie

1. **B — zapamiętywanie klucza API.** Najkrótszy i zdejmuje tarcie z testowania wszystkiego pozostałego.
2. **A — emocje rozmówcy w czacie.** Największy ładunek projektowy, zasoby już w repo.
3. **C — SQLite dla rankingu.** Najwięcej kodu, najmniej niejasności; istniejące 13 testów staje się siatką regresyjną.

## Założenia przyjęte bez konsultacji

Te decyzje nie zapadły w rozmowie. Podejmuję je, żeby nie blokować pracy — każda jest odwracalna i oznaczona miejscem w kodzie.

| Projekt | Decyzja | Dlaczego tak |
|---|---|---|
| B | `sessionStorage`, nie `localStorage`, i wyłącznie po zaznaczeniu zgody | Przeżywa odświeżenie (cały zysk), ginie z zamknięciem karty. Scenariusz warsztatowy na cudzym laptopie zostaje bezpieczny bez pytania użytkownika o czujność. |
| A | Emocja pokazywana **przy każdej wypowiedzi w czacie** oraz na avatarze w panelu bocznym | Prośba brzmiała „w przestrzeni czatu". Portret przy dymku tworzy widoczny zapis przebiegu przesłuchania — widać, w którym momencie postać pękła. |
| A | Emocja przy dymku jest **zamrożona w chwili wypowiedzi**, avatar w panelu pokazuje stan bieżący | Historia rozmowy nie powinna się zmieniać wstecz. |
| C | `node:sqlite` (wbudowany w Node 24), nie `better-sqlite3` | Zero zależności natywnych i kompilacji przy instalacji. |
| C | Kody i limity przenoszone do bazy razem z wynikami | Dziś restart serwera kasuje ochronę przed spamem — to realna dziura, nie kosmetyka. |

---

## B — zapamiętywanie klucza API

**Pliki:** `sekcja-zwlok.html`.

Pod polem klucza dochodzi checkbox „Zapamiętaj klucz w tej karcie (do zamknięcia przeglądarki)". Zaznaczenie zapisuje klucz do `sessionStorage` przy starcie gry; odznaczenie natychmiast czyści zapis. Przy ładowaniu strony klucz jest odczytywany i wstawiany do pola, a checkbox zaznaczany.

Zmiana dotyka też dwóch miejsc z obietnicami, które przestałyby być prawdziwe:
- nota pod polem klucza (`:221`): „Nigdzie go nie zapisujemy" → opis warunkowy;
- `PRIVACY_HTML` i `TERMS_HTML` §2 pkt 2 — klucz może być zapisany w pamięci karty **na wyraźne życzenie**, nigdy nie opuszcza przeglądarki.

**Testy:** w przeglądarce — zaznaczenie, przeładowanie, sprawdzenie że pole wypełnione; odznaczenie i przeładowanie, sprawdzenie że puste; weryfikacja że `localStorage` pozostaje nietknięty.

---

## A — emocje rozmówcy w czacie

**Pliki:** `sekcja-zwlok.html`, `test/emocje.test.js`.

### Model napięcia

Cztery ustalone sygnały składają się na jedną liczbę `0…1` liczoną osobno dla każdej postaci:

| Sygnał | Wkład |
|---|---|
| Nacisk — kolejne pytania pod rząd do tej samej osoby | +0,22 za pytanie, zerowane przy zmianie rozmówcy |
| Konfrontacja — w pytaniu pada imię innej postaci | +0,35 jednorazowo, plus wymuszone `zaskoczenie` na tę jedną odpowiedź |
| Zegar śledztwa — postęp do `MAX_Q` | +0,25 × udział wykorzystanego budżetu, wspólny dla wszystkich |
| Powrót do porzuconego rozmówcy | +0,15, gdy wracamy po co najmniej dwóch pytaniach do kogoś innego |

Ostygnięcie: −0,10 za każde pytanie zadane komu innemu.

### Mapowanie na emocje

Napięcie dzieli się na cztery poziomy, a wybór emocji zależy od strategii obronnej postaci — ten sam nacisk daje inną minę u każdego. To celowe: mimika ma uczyć, jak różni ludzie pękają.

| Postać | spokój | narastanie | wysokie | skrajne |
|---|---|---|---|---|
| Marek (unika) | neutral | smutek | zaskoczenie | rezygnacja |
| Beata (czaruje) | neutral | radosc | zaskoczenie | zlosc |
| Tomek (zgorzkniały) | neutral | radosc | zlosc | rezygnacja |
| Iwona (zmęczona) | neutral | smutek | rezygnacja | zlosc |

Progi: `<0,30` spokój, `<0,55` narastanie, `<0,80` wysokie, dalej skrajne. Konfrontacja nadpisuje wynik na `zaskoczenie` dla jednej odpowiedzi.

### Struktura kodu

Logika napięcia jako **funkcje czyste** w bloku oznaczonym `// <emocje>` … `// </emocje>` wewnątrz skryptu gry. Test wczytuje `sekcja-zwlok.html`, wycina ten blok i wykonuje go w izolacji — dzięki temu gra zostaje jednym plikiem bez backendu (jej główna zaleta), a logika i tak ma prawdziwe testy jednostkowe.

Renderowanie: `addMsg()` przyjmuje opcjonalną nazwę pliku portretu i wstawia go przy dymku; avatar w panelu podmienia `src` na wariant emocji. Brak pliku grafiki cofa się do obecnego zachowania — dymek bez portretu, inicjały na avatarze.

**Testy:** progi i przejścia poziomów, zerowanie serii przy zmianie rozmówcy, ostygnięcie, nadpisanie konfrontacją, poprawność mapowania dla każdej z czterech postaci, wykrywanie imion w pytaniu (w tym odmiana: „Tomka", „Beacie").

---

## C — SQLite dla rankingu

**Pliki:** `ranking-server.js`, `test/pojedynek.test.js` (bez zmian w asercjach — to jest cel), `test/migracja.test.js`.

Cztery tabele: `scores`, `challenges`, `codes`, `rate_limits`. Kody i liczniki limitów przenoszą się z `Map` do bazy, więc restart serwera przestaje kasować ochronę przed spamem.

Migracja przy starcie: jeśli istnieje `ranking-data.json` i baza jest pusta, dane zostają przepisane, a plik zmieniony na `ranking-data.json.migrated`. Operacja jednorazowa i nieniszcząca — oryginał zostaje na dysku.

**Kryterium sukcesu:** istniejące 13 testów przechodzi bez zmiany choćby jednej asercji. Jeśli któryś wymaga poprawki, znaczy to, że zmieniło się zachowanie API, a miało się zmienić wyłącznie miejsce przechowywania.

**Dodatkowe testy:** migracja z pliku JSON zachowuje wyniki i pojedynki; ponowny start nie duplikuje danych; kod autoryzacyjny przeżywa restart procesu.

---

## Reguły wspólne

- Każdy projekt kończy się zielonym `npm test` przed commitem — bez wyjątków.
- Zmiany dotykające obietnic w `PRIVACY_HTML` lub `TERMS_HTML` idą w tym samym commicie co kod, którego dotyczą.
- Nowa funkcja nie ma prawa pogorszyć działania gry bez backendu.
