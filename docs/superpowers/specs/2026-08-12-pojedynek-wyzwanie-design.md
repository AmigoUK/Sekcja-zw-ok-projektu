# Pojedynek — wyzwanie znajomego na pobicie wyniku

Data: 2026-08-12 · Status: zatwierdzony do wdrożenia

## Cel

Gracz, który zapisał wynik w rankingu, może wyzwać znajomego mailem: „pobij mój wynik". Wyzwany dostaje link, gra ten sam scenariusz, a po debriefie odpowiada na wyzwanie. Wyzywający dostaje powiadomienie o rozstrzygnięciu.

Funkcja ma dać satysfakcję ze starcia bez tworzenia bazy danych osób, które nigdy się nie zapisały.

## Decyzje projektowe

| Decyzja | Wybór | Powód |
|---|---|---|
| Zasięg | Pełny pojedynek z rozstrzygnięciem | „Pobij mój wynik" bez informacji zwrotnej nie domyka pętli |
| Nośnik wyzwania | Token nieprzezroczysty + minimalny stan serwera | Link jest jawny; dane w nim są publiczne |
| Ścieżka wyzwanego | Wybór: anonimowo albo z weryfikacją mailową | Pojedynek działa nawet gdy wyzwany nie chce zostawiać adresu |
| Moment wysyłki | Trzeci krok modalu, po zapisaniu wyniku | Bilet z `submit-score` znosi potrzebę drugiej rundy kodu |

Odrzucone: token samonośny z szyfrowaniem (własna kryptografia to zbędne ryzyko), token z jawnymi danymi (ujawnia adres wyzywającego), tabela pojedynków (wymaga przechowywania relacji między osobami).

## Architektura

### Akt I — rzucenie wyzwania

1. Gracz zapisuje wynik istniejącą ścieżką: `request-code` → `submit-score` z kodem.
2. `submit-score` zwraca dodatkowo **bilet** — 32 losowe bajty hex, ważny 60 minut, w pamięci serwera.
3. Modal zapisu, zamiast się zamknąć, pokazuje trzeci ekran: imię znajomego, jego adres, oświadczenie.
4. Gra woła `POST /api/challenge` z biletem. Serwer wysyła maila i **dopiero po udanej wysyłce** zapisuje wyzwanie.

### Akt II — odebranie wyzwania

1. Link: `<GAME_URL>?w=<id>`.
2. Skrypt przy starcie czyta `?w=`, woła `GET /api/challenge/:id`, pokazuje ekran powitalny z nickiem wyzywającego, jego wynikiem i scenariuszem.
3. Kontekst ląduje w `state.challenge` i przeżywa całą rozgrywkę.

`GET /api/challenge/:id` zwraca `{ nick, score, scenario, status }`, gdzie `status` to `open`, `answered` albo `expired`. Nigdy nie zwraca adresu wyzywającego. Dla `answered` gra pokazuje wynik starcia i wpuszcza do zwykłej rozgrywki bez kontekstu wyzwania — pojedynek jest rozstrzygnięty raz i nie da się go powtórzyć.

### Akt III — rozstrzygnięcie

Po debriefie pasek wyniku pokazuje „⚔️ Odpowiedz na wyzwanie". Dwie drogi:

- **anonimowa** — `POST /api/challenge/:id/answer` z nickiem i wynikiem, bez weryfikacji;
- **zweryfikowana** — normalny `request-code` → `submit-score` z dodatkowym polem `challengeId`; wynik trafia też do rankingu ogólnego.

Obie schodzą się w jednej funkcji `resolveChallenge()`, która zapisuje odpowiedź i wysyła powiadomienie do wyzywającego.

### Stan

| Struktura | Miejsce | Czas życia | Powód |
|---|---|---|---|
| `db.challenges` | `ranking-data.json` | 14 dni | Link musi przeżyć restart serwera |
| `tickets` | pamięć (`Map`) | 60 min | Restart w tym oknie naprawia się ponownym zapisem |
| `challengerLog` | pamięć | 24 h | Limit wysyłek po zweryfikowanym adresie |
| `targetLog` | pamięć | 24 h | Limit po **solonym skrócie** adresu docelowego |

Rekord wyzwania: `{ id, challengerEmail, challengerNick, score, scenario, created, expires, answer: null | { nick, score, date, verified } }`.

Adres wyzwanego nie jest zapisywany nigdzie — ani w rekordzie, ani w logu limitów (tam trafia wyłącznie skrót).

## Bezpieczeństwo i dane osobowe

1. **Brak pola na wolny tekst.** Szablon maila jest sztywny; zmienne to nick wyzywającego, wynik i scenariusz.
2. **Nick z bazy, nie z żądania.** Serwer odczytuje nick z `db.scores` po adresie z biletu. Mail może więc zawierać wyłącznie tekst, który nadawca już opublikował w rankingu pod zweryfikowanym adresem.
3. **Limity dwustronne.** Maks. 5 wyzwań na dobę od jednego wyzywającego; maks. 2 wyzwania na dobę na ten sam adres docelowy, niezależnie od nadawcy. Bilet jednorazowy.
4. **Limit adresata bez przechowywania adresu.** `sha256(CHALLENGE_SALT + adres)` ze znacznikiem czasu, w pamięci, 24 h. Z zapisu nie da się odtworzyć adresu bez znajomości soli.
5. **Odrzucenie wyzwania samego siebie** — najprostszy test na przekaźnik.
6. **Oświadczenie** w formularzu: „Znam tę osobę i mam podstawy sądzić, że chce dostać ode mnie tę wiadomość".
7. **Treść maila** wyjaśnia: kto podał adres, że adres nie został zapisany, że to jedyna wiadomość.

Dokumenty: `PRIVACY_HTML` — punkt o jednorazowym użyciu adresu osoby trzeciej bez retencji. `TERMS_HTML` — odpowiedzialność użytkownika za podstawy kontaktu.

## Zmiany w plikach

**`ranking-server.js`** — nowe struktury i stałe, trzy endpointy (`POST /api/challenge`, `GET /api/challenge/:id`, `POST /api/challenge/:id/answer`), dwie zmiany w `submit-score` (zwraca bilet, przyjmuje `challengeId`), wspólna `resolveChallenge()`. Eksport funkcji pomocniczych do testów przy zachowaniu uruchamiania jako skrypt (`require.main === module`).

**Nowe zmienne środowiskowe:** `CHALLENGE_SALT` (sól do skrótów), `GAME_URL` (baza linku). Brak `GAME_URL` wyłącza funkcję wyzwań, analogicznie do tego, jak brak `SMTP_HOST` wyłącza wysyłkę.

**`sekcja-zwlok.html`** — `state.challenge`, odczyt `?w=`, ekran powitalny wyzwania, przycisk w pasku wyniku (`:264`), trzeci ekran modalu (`:861`), obsługa nowych ścieżek w `demoApi` (`:826`), zmiany w `PRIVACY_HTML` i `TERMS_HTML`.

## Obsługa błędów

**Reguła nadrzędna: nic związanego z pojedynkiem nie może zablokować grania.** Wygasły link, nieznany identyfikator i niedostępny backend kończą się startem normalnej gry z krótkim wyjaśnieniem.

| Sytuacja | Zachowanie |
|---|---|
| Bilet wygasł | Wynik jest zapisany, nic nie ginie; komunikat mówi, że wyzwanie wysyła się zaraz po zapisie |
| SMTP padł przy wysyłce wyzwania | Wyzwanie nie powstaje (zapis dopiero po udanej wysyłce) |
| SMTP padł przy powiadomieniu | Odpowiedź zapisana, błąd do logu, wyzwany widzi potwierdzenie |
| Druga odpowiedź na to samo wyzwanie | 409, pierwsza wygrywa |
| Wyzwanie samego siebie | 400 |
| Brak `GAME_URL` | Endpointy wyzwań zwracają 503; gra ukrywa przyciski |

## Testowanie

**Tryb deweloperski.** Bez `SMTP_HOST` treść maila i gotowy link wypisują się na konsolę — tak jak dziś kody autoryzacyjne (`ranking-server.js:84-86`). Pełny pojedynek przechodzi się lokalnie w dwóch kartach, bez wysyłania maili.

**Ścieżka ręczna:** karta 1 — gra, zapis wyniku kodem z konsoli, wyzwanie; link z konsoli w oknie prywatnym — gra, odpowiedź; powiadomienie na konsoli.

**Testy jednostkowe** (`node:test`, wbudowany w Node 24, zero zależności):
- przesuwane okno limitów: 5. wyzwanie przechodzi, 6. odrzucone, po upływie okna znowu przechodzi;
- skrót z solą: ten sam adres → ten sam skrót; inna sól → inny skrót;
- wygasanie wyzwań i biletów;
- odrzucenie drugiej odpowiedzi;
- odrzucenie wyzwania samego siebie;
- nick w mailu pochodzi z `db.scores`, a nie z żądania.

## Poza zakresem

Tabela pojedynków i bilans zwycięstw, wyzwania bez zapisu wyniku w rankingu, wyzwania grupowe, wielokrotne odpowiedzi na jedno wyzwanie, rewanż jednym kliknięciem.
