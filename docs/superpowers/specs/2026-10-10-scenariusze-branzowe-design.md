# Scenariusze branżowe — gra jako platforma szkoleniowa

Data: 2026-10-10 · Status: projekt do przeglądu

## Cel

Gra przestaje być symulatorem jednej sprawy (FENIKS) i staje się publiczną biblioteką spraw z kilku domen. Pierwsza domena spoza projektów IT to **bezpieczeństwo żywności**, druga to **incydent bezpieczeństwa danych (RODO)**. Mechanika się nie zmienia: przesłuchanie, ukryta prawda, fałszywe tropy, konfrontacja krzyżowa, raport, debrief. Scenariusze branżowe dokładają do niej wiedzę merytoryczną, której gracz uczy się w debriefie.

Sukces wygląda tak: gracz wybiera sprawę z listy na ekranie startowym, gra ją bez żadnej różnicy w obsłudze względem FENIKSA, a w debriefie dostaje oprócz oceny techniki krótką lekcję zasad branżowych ze źródłem właściwym dla jurysdykcji sprawy.

## Decyzje projektowe

| Decyzja | Wybór | Powód |
|---|---|---|
| Model użycia | Publiczny produkt edukacyjny: ranking i pojedynki zostają | Bez kont firmowych, panelu prowadzącego i certyfikatów (YAGNI) |
| Rola wiedzy branżowej | Hybryda z poziomami | Niższe poziomy rozwiązuje sama technika, wyższe wymagają wiedzy, którą częściowo da się wyciągnąć od świadka-eksperta |
| Jurysdykcja | Deklarowana per scenariusz (PL / UK / UE) | Zasady HACCP są wspólne, różnią się organy i przepisy o alergenach; obsługujemy polskich pracowników branży w UK |
| Zakres tej rundy | Żywność 🇵🇱 + żywność 🇬🇧 + RODO 🇵🇱 | Druga, odległa domena dowodzi, że format jest naprawdę wielodomenowy |
| Źródło scenariuszy | Pliki `gpt/scenariusz-*.md` wstrzykiwane do HTML skryptem budującym | Jedno źródło dla gry i Custom GPT; gra zostaje jednym plikiem działającym z `file://` |
| Rubryka | 60/20/20 bez zmian | Wyniki porównywalne, istniejący ranking ważny |

Odrzucone:
- scenariusze ręcznie wpisane jako obiekty JS (dwie kopie treści, rozjazd z GPT);
- `fetch` plików `.md` w trakcie gry (nie działa z `file://`);
- ranking łączny wszystkich spraw (różne poziomy trudności czynią sumę bezsensowną);
- osobna pula punktów za wiedzę branżową (dawałaby przewagę ludziom z branży w publicznym rankingu).

## Architektura

### Format scenariusza

Każdy plik `gpt/scenariusz-NN-nazwa.md` zaczyna się blokiem metadanych. Custom GPT czyta go jako zwykły tekst i nie przeszkadza mu on; reszta pliku zostaje prozą według `gpt/szablon-scenariusza.md`.

```yaml
---
id: CHLODNIA
tytul: "CHŁODNIA — zatrucie po przyjęciu komunijnym"
domena: zywnosc
jurysdykcja: PL
poziom: 2
pytania: 25
postacie:
  - imie: Halina
    nazwisko: Krupa
    rola: "Kierowniczka kuchni"
    strategia: unika
    odmiana: [Halina, Haliny, Halinie, Halinę, Haliną, Halino]
---
```

| Pole | Wartości | Uwagi |
|---|---|---|
| `id` | `[A-Z0-9_]{1,40}` | Klucz w rankingu i pojedynkach. Niezmienny po publikacji. FENIKS zachowuje `FENIKS`. |
| `tytul` | tekst | Nagłówek karty sprawy i akt. |
| `domena` | `projekty`, `zywnosc`, `rodo` | Grupowanie na ekranie startowym. Nowa domena = nowa wartość + etykieta i ikona w słowniku domen w HTML. |
| `jurysdykcja` | `PL`, `UK`, `UE` | Flaga na karcie i ramy prawne w debriefie. Scenariusze projektowe: `UE`, flaga nie jest wyświetlana. |
| `poziom` | 1–5 | 1 wprowadzający … 5 ekspercki. Sortowanie w obrębie domeny. |
| `pytania` | liczba | Zastępuje stałą `MAX_Q`. |
| `postacie[].strategia` | `unika`, `czaruje`, `zgorzknialy`, `zmeczony`, `agresywny` | Wybiera łuk emocji. |
| `postacie[].odmiana` | lista form | Buduje dopasowanie konfrontacji zamiast ręcznych regexów. Pierwsza forma = mianownik = klucz postaci i prefiks odpowiedzi modelu `[Imię]`. |

Dwie zmiany w części prozatorskiej szablonu:
- w karcie postaci opcjonalna linia `- Wiedza branżowa:` — zasada, którą ta postać wyjaśnia, gdy gracz zapyta o nią wprost;
- nowa sekcja `## ZASADY DO DEBRIEFU` — lista reguł przypisanych do etykiet przyczyn, każda ze źródłem (akt prawny lub wytyczna urzędu, z linkiem).

### Łuki emocji według strategii

`EMOCJE_ARC` przestaje być słownikiem imion, a staje się słownikiem strategii. Cztery istniejące łuki przechodzą bez zmian, dochodzi jeden:

| Strategia | Łuk | Dziś |
|---|---|---|
| `unika` | neutral → smutek → zaskoczenie → rezygnacja | Marek |
| `czaruje` | neutral → radość → zaskoczenie → złość | Beata |
| `zgorzknialy` | neutral → radość → złość → rezygnacja | Tomek |
| `zmeczony` | neutral → smutek → rezygnacja → złość | Iwona |
| `agresywny` | neutral → złość → złość → rezygnacja | nowa |

Funkcje `poPytaniu`, `napiecieDla`, `emocjaDla`, `wykryjKonfrontacje` dostają aktywny scenariusz (lista postaci z ich strategią i regexem) zamiast czytać stałe globalne. Regex konfrontacji budowany z `odmiana` używa tych samych granic Unicode co dziś: `(?<!\p{L})(forma1|forma2|…)(?!\p{L})` z flagą `iu`, formy escapowane.

Grafiki: gra szuka `img/<id-małymi>/<imie-małymi>.png` i `img/<id-małymi>/emocje/<imie>-<emocja>.jpg`. Przy braku pliku działa istniejący fallback do inicjałów (portret w panelu) i do usunięcia obrazka (portret przy dymku). FENIKS zachowuje obecne ścieżki `img/*.png` i `img/emocje/*` — wyjątek zapisany w jednym miejscu.

### Silnik w grze

Treść z dzisiejszego `<script id="sysprompt">` rozdziela się na:
- `gpt/silnik-gra.md` — reguły gry dla aplikacji (bez komend START / SCENARIUSZ z Custom GPT), z dwiema nowymi regułami:
  1. świadkowie i debrief posługują się realiami jurysdykcji scenariusza (organy, nazwy dokumentów, przepisy);
  2. debrief dla scenariusza z sekcją `ZASADY DO DEBRIEFU` zawiera część „Lekcja branżowa”: przy każdej przyczynie zasada, która została naruszona, i jej źródło. Lekcja nie wpływa na punktację.
- treść FENIKSA, która już istnieje w `gpt/scenariusz-01-feniks.md`.

Przy starcie sprawy prompt systemowy = `silnik-gra.md` + treść wybranego scenariusza (bez bloku YAML).

Wiedza branżowa wpływa na ocenę wyłącznie w części „Rekomendacje (20 pkt)”: rekomendacja musi być zgodna z zasadami scenariusza i konkretna, żeby dostać pełne punkty. Reguła ta trafia do rubryki w `silnik-gra.md`.

### Budowanie

`npm run build` (`scripts/build-scenariusze.js`, bez zależności):
1. czyta `gpt/silnik-gra.md` i wszystkie `gpt/scenariusz-*.md`;
2. parsuje blok YAML własnym parserem dla naszego podzbioru (skalary, listy w nawiasach, lista obiektów `postacie`);
3. waliduje: wymagane pola, unikalne `id`, poprawna `strategia`, rozłączne zbiory `odmiana` między postaciami jednej sprawy, istnienie sekcji `UKRYTA PRAWDA` i `POSTACIE`;
4. zastępuje zawartość między `// <scenariusze>` a `// </scenariusze>` w `sekcja-zwlok.html` stałymi `SILNIK` i `SCENARIUSZE` (tablica `{meta, tresc}` posortowana po domenie i poziomie), zapisanymi przez `JSON.stringify`.

Błąd walidacji kończy skrypt kodem 1 z nazwą pliku i pola. HTML nie zostaje wtedy zmieniony.

### Ekran startowy

Obok wyboru silnika AI pojawia się lista spraw pogrupowana według domen. Karta sprawy: tytuł, flaga jurysdykcji (poza `UE`), poziom jako kropki, liczba pytań, pierwsze zdanie sekcji TŁO. Domyślnie FENIKS. Ostatni wybór zapisywany w `localStorage` (try/catch, brak = FENIKS).

Po wyborze sprawy z metadanych generują się: panel rozmówców (dziś zaszyty w HTML), akta sprawy (TŁO), nagłówek „sprawa: …”, licznik pytań.

### Ranking

`GET /api/leaderboard?scenario=ID` zwraca 50 najlepszych wyników tej sprawy. Bez parametru — zachowanie jak dziś. Schemat bazy bez zmian (klucz `(email, scenario)` już istnieje).

W grze modal rankingu ma zakładki spraw obecnych w rankingu, domyślnie otwarta na sprawie bieżącej. Tryb demo filtruje `state.demoRank` tak samo.

### Pojedynki

Wejście przez `?w=` ustawia sprawę z wyzwania i blokuje jej wybór na ekranie startowym. Jeśli `scenario` z wyzwania nie istnieje w `SCENARIUSZE` tej wersji gry, ekran powitalny mówi o tym wprost („Ta sprawa nie jest dostępna w tej wersji gry”) i wpuszcza do zwykłej rozgrywki bez kontekstu wyzwania. Backend bez zmian.

## Nowe scenariusze

Pełne treści powstają w implementacji według szablonu; poniżej uzgodniony szkielet.

### 07 CHŁODNIA 🇵🇱 — żywność · poziom 2 · 25 pytań

Firma cateringowa przygotowała przyjęcie komunijne dla 180 osób; ponad 60 gości zachorowało, sanepid prowadzi dochodzenie epidemiologiczne. Właściciel wynajmuje gracza przed decyzją PPIS.

- Przyczyny: schładzanie gulaszu w 50-litrowych garnkach w zwykłej chłodni, bo schładzarka szokowa była zepsuta od 3 tygodni, a naprawę odkładano; zlecenie na 180 porcji przy mocach na ~100, więc gotowanie dzień wcześniej; karty temperatur wypełniane z pamięci na koniec tygodnia; HACCP kupiony jako szablon bez CCP dla schładzania.
- Postacie: Ryszard — właściciel (`agresywny`), Halina — kierowniczka kuchni (`unika`), Kuba — kucharz (`zmeczony`), Ewa — zewnętrzna konsultantka HACCP (`czaruje`).
- Konfrontacje: SMS Kuby do szefa o szokówce łamie Ryszarda; faktura Ewy (wdrożenie bez wizyty w kuchni) łamie wersję Haliny „mamy HACCP”.
- Fałszywe tropy: „zepsute mięso od dostawcy”, „goście jedli lody na festynie”, „Kuba nie mył rąk” (kozioł ofiarny).

### 08 SEZAM 🇬🇧 — żywność · poziom 3 · 25 pytań

Polska piekarnia w Leicester sprzedaje kanapki pakowane na miejscu (PPDS). Klientka z alergią na sezam trafiła do szpitala; po wizycie EHO ocena higieny może spaść. Właścicielka wynajmuje gracza.

- Przyczyny: dostawca zamienił mieszankę posypki na wersję z sezamem, nikt nie sprawdził nowej specyfikacji; szablon etykiety niepowiązany z wersją receptury; szkolenie z alergenów raz, przy zatrudnieniu, tylko po angielsku; brak procedury odpowiadania na pytania klientów o alergeny.
- Postacie: Grażyna — właścicielka (`unika`), Kasia — kierowniczka produkcji (`czaruje`), Darek — piekarz nocnej zmiany (`zgorzknialy`), Priya — obsługa sali (`zmeczony`).
- Nowa mechanika: **dowód w wersjach** — prawdę ujawnia dopiero zestawienie dwóch dokumentów (stara i nowa specyfikacja dostawcy; etykieta i receptura).
- Ramy: Natasha's Law (PPDS), 14 alergenów, wytyczne FSA, Food Hygiene Rating Scheme.

### 09 WYCIEK 🇵🇱 — RODO · poziom 3 · 25 pytań

Sieć szkół językowych, baza 40 tys. kursantów wypłynęła na forum, zgłoszenie do UODO po 9 dniach. Rada nadzorcza wynajmuje gracza.

- Przyczyny: MFA dla kont administracyjnych zaproponowane i wycięte z budżetu; pełna kopia produkcyjnej bazy na publicznie dostępnym serwerze testowym; prezes wstrzymał zgłoszenie (art. 33 RODO — 72 godziny), bo trwały rozmowy z inwestorem; IOD dowiedział się z mediów — brak procedury eskalacji.
- Postacie: Robert — prezes (`agresywny`), Paweł — administrator (`zgorzknialy`), Monika — księgowa, która kliknęła link (`zmeczony`, obwinia się ponad miarę), Adam — zewnętrzny IOD (`czaruje`).
- Fałszywe tropy: „Monika kliknęła” (iskra, nie przyczyna), „zaawansowana grupa APT”, „IOD powinien był wiedzieć”.

### Warunek publikacji treści merytorycznej

Każda zasada w `ZASADY DO DEBRIEFU` i każda liczba w linii `Wiedza branżowa` ma źródło sprawdzone w treści aktu lub wytycznej przed wpisaniem (np. limity czasu i temperatury schładzania mogą się różnić między wytycznymi PL i UK). Zasada bez sprawdzonego źródła nie trafia do scenariusza.

## Migracja istniejących scenariuszy

- `scenariusz-01` … `06` dostają blok YAML (domena `projekty`, jurysdykcja `UE`, poziomy według tabeli w `koncept.md`).
- FENIKS w grze przechodzi z treści zaszytej w HTML na `gpt/scenariusz-01-feniks.md`. Przed przełączeniem porównuję obie wersje i przenoszę do pliku `.md` różnice, które istnieją tylko w HTML, żeby rozgrywka FENIKSA się nie zmieniła.
- Postacie scenariuszy 02–06 grają z inicjałami (brak grafik); emocje działają według strategii.

## Testy

- `test/scenariusze.test.js`:
  - blok `// <scenariusze>` w HTML jest identyczny z wynikiem budowania (wykrywa zapomniany `npm run build`);
  - walidator odrzuca: brak pola, zduplikowane `id`, nieznaną strategię, kolizję form `odmiana`;
  - parser YAML czyta wszystkie scenariusze w repo.
- `test/emocje.test.js` — dostosowany do sygnatur ze scenariuszem; dotychczasowe przypadki (odmiana Beaty, granice Unicode) przechodzą przez ścieżkę `odmiana`. Nowe przypadki: łuk `agresywny`, imię angielskie z polską końcówką („Priyi”, „Priyą”).
- `ranking-server` — test `leaderboard?scenario=` (filtr) i bez parametru (stare zachowanie).
- Ręcznie: przejście sprawy CHŁODNIA w przeglądarce od ekranu startowego do debriefu z sekcją „Lekcja branżowa”; wejście przez link wyzwania na sprawę nieistniejącą.

## Poza zakresem

Konta firmowe i panel prowadzącego, certyfikaty, ranking łączny, grafiki dla nowych postaci (prompty mogą powstać później w `prompty-grafiki.md`), scenariusze z ochrony zdrowia, angielska wersja interfejsu.

## Wersja

Nowa funkcja widoczna dla użytkownika: wersja w `package.json` z `1.0.0` na `1.1.0`.
