# „Sekcja zwłok projektu" — koncept narzędzia edukacyjnego

*Interaktywna gra narracyjna ucząca prowadzenia post-mortem, analizy przyczyn źródłowych i odróżniania faktów od narracji. Sześć scenariuszy na czterech poziomach trudności + talia losowych modyfikatorów.*

---

## 1. Problem edukacyjny

Analiza przyczyn porażki projektu to jedna z najcenniejszych i najtrudniejszych umiejętności w pracy zespołowej — i prawie niemożliwa do wyćwiczenia. Prawdziwe post-mortemy zdarzają się rzadko, są politycznie napięte, a błędy facylitatora mają realne koszty. Kursy uczą teorii (5× dlaczego, RCA, pytania otwarte), ale nie dają miejsca, gdzie można ją bezpiecznie przećwiczyć na żywym, stawiającym opór rozmówcy.

Tę lukę wypełnia symulator: AI nie jest tu wykładowcą, tylko **przeciwnikiem** — członkami zespołu upadłego projektu, z których każdy ma swoją wersję zdarzeń, swoje interesy i swoje tajemnice.

## 2. Mechanika interakcji — jak AI angażuje użytkownika

Gracz jest facylitatorem post-mortem wynajętym po upadku projektu. Rozgrywka ma trzy fazy:

**Faza 1 — Śledztwo.** Gracz przesłuchuje postacie (3–5 zależnie od scenariusza), swobodnie przełączając się między nimi. Ma budżet **20–30 pytań** — ograniczenie wymusza strategię zamiast pytania o wszystko. Postacie:

- serwują własne narracje („klient nie wiedział, czego chce", „delivery nie udźwignęło", „rynek nie był gotowy"),
- kłamią przez pomijanie i pamiętają, co powiedziały,
- ujawniają ukryte fakty **tylko** po spełnieniu warunków odblokowania: właściwe pytanie otwarte, prośba o konkretny dokument albo konfrontacja z zeznaniem innej postaci.

Kluczowy mechanizm angażujący to **konfrontacja krzyżowa**: zeznanie jednej postaci jest amunicją na inną (tech lead ujawnia zignorowany e-mail ostrzegawczy → to łamie PM-a; klientka wspomina „obiecaną" integrację → to łamie sprzedaż). Gra zamienia się w detektywistyczną układankę, w której wiedza zdobyta w jednej rozmowie otwiera drzwi w kolejnej.

**Faza 2 — Raport.** Po zakończeniu śledztwa gracz pisze raport post-mortem: przyczyny źródłowe, rozróżnienie skutków od przyczyn, trzy rekomendacje.

**Faza 3 — Debrief.** AI wychodzi z roli i ocenia raport względem „ukrytej prawdy" — listy rzeczywistych przyczyn zapisanych w scenariuszu.

## 3. Architektura — silnik + biblioteka scenariuszy

Narzędzie ma architekturę dwuwarstwową, wymuszoną pierwotnie przez limit 8 000 znaków instrukcji w Custom GPT — i lepszą projektowo od monolitu:

**Silnik (master prompt, ~6,4 tys. znaków)** — uniwersalne reguły gry, komendy (START / SCENARIUSZ / ROZMOWA / RAPORT / DEBRIEF), rubryka oceny i sytuacje brzegowe. Zero treści fabularnej.

**Biblioteka scenariuszy (pliki wiedzy)** — każdy scenariusz to osobny plik o stałej strukturze: TŁO (jawne), UKRYTA PRAWDA (przyczyny źródłowe), FAŁSZYWE TROPY, POSTACIE (ton, narracja, co ukrywa, warunki odblokowania, częściowa racja), UWAGI DO DEBRIEFU. Dodanie scenariusza = dodanie pliku; silnik sam pokazuje go na liście wyboru. Do tworzenia kolejnych służy szablon z regułami projektowymi (m.in. zasada dwóch par konfrontacji krzyżowej).

**Drabinka trudności** — każdy poziom podnosi poprzeczkę nową mechaniką, nie tylko liczbą postaci:

| Nr | Scenariusz | Poziom | Nowa mechanika |
|----|-----------|--------|----------------|
| 03 | BILBORD — wtopa kampanii | wprowadzający | 3 postacie, szybkie ustępowanie, 20 pytań |
| 01 | FENIKS — upadłe wdrożenie ERP | podstawowy | pełna konfrontacja krzyżowa, 25 pytań |
| 04 | BLACKOUT — awaria w Black Friday | średni | kozioł ofiarny: świadek obwiniający się ponad miarę; iskra ≠ przyczyna |
| 02 | NOVA — upadły startup | zaawansowany | konflikt personalny maskuje przyczyny systemowe; konflikt interesów (earn-out u foundera w 05) |
| 05 | PRZEJĘCIE — exodus po akwizycji | zaawansowany | świadek-test: 70% prawdy, 30% plotek — obowiązkowa weryfikacja źródeł |
| 06 | KONSORCJUM — projekt publiczny | ekspercki | **zmowa dwóch świadków**: spójne zeznania ≠ prawda; łamią ich tylko dokumenty; 5 postaci, 30 pytań |

**Talia modyfikatorów (regrywalność)** — opcjonalna warstwa losowa: jawny kontekst rynkowy (recesja, media, firma na sprzedaż…), niejawne zdarzenie w trakcie śledztwa (anonimowa koperta, wyciek do prasy, skrócenie budżetu pytań…) i niejawny modyfikator jednego świadka (prawnik u boku, wypalenie, nagrywanie rozmowy…). Losowanie jest deterministyczne z liczby podanej przez gracza (AI nie może „oszukiwać"), a zasada nadrzędna brzmi: modyfikatory zmieniają koszt i drogę dotarcia do prawdy, **nigdy samą prawdę** — dzięki czemu wyniki między rozgrywkami pozostają porównywalne.

## 4. Serce narzędzia — konstrukcja promptów

Trzy elementy robią z instrukcji systemowej skutecznego nauczyciela:

**a) Ukryta prawda jako klucz odpowiedzi.** Scenariusz zawiera zamkniętą listę przyczyn źródłowych oraz **fałszywe tropy** — narracje postaci brzmiące jak przyczyny. Dzięki temu ocena końcowa nie jest uznaniowa: AI porównuje raport gracza z listą faktów.

**b) Warunki odblokowania zamiast swobodnej improwizacji.** Każda postać ma zapisane, *co ukrywa* i *jakie zachowanie gracza to ujawnia*. To najważniejsza decyzja projektowa: nagroda za dobrą technikę pytań jest wbudowana w mechanikę gry (dostajesz fakt), a nie w pochwałę („dobre pytanie!"). Pytania zamknięte i ogólnikowe dostają z definicji odpowiedzi wymijające.

**c) Postacie z częściową racją.** Każda postać w czymś kłamie i w czymś ma rację — jak w prawdziwym post-mortem. To uczy najtrudniejszego: nie „kto kłamie", ale „która część czyjej wersji jest prawdą".

## 5. Analiza wartości — cel nauki i weryfikacja wiedzy

**Cele edukacyjne (konkretne, obserwowalne):**

1. Zadawanie pytań otwartych i dopytywanie o fakty (dokumenty, daty, decyzje) zamiast przyjmowania interpretacji.
2. Analiza przyczyn źródłowych — drążenie łańcuchów „dlaczego → dlaczego → dlaczego" aż do przyczyny systemowej, nie personalnej.
3. Odróżnianie faktów od narracji — rozpoznawanie, że spójna i chętnie opowiadana historia to często zasłona (w scenariuszu eksperckim: że spójność DWÓCH zeznań też nią bywa).
4. Prowadzenie konfrontacji bez agresji — postacie usztywniają się przy tonie oskarżycielskim; empatia i bezpieczeństwo psychologiczne są mechaniką, nie ozdobą (w BLACKOUT bez nich nie da się dotrzeć do kluczowego dowodu).
5. Weryfikacja źródeł — świadkowie emocjonalni mieszają prawdę z plotkami; przepisanie plotki do raportu kosztuje punkty.

**Jak AI weryfikuje przyswojenie wiedzy — trzy niezależne pomiary:**

- **W trakcie gry (behawioralnie):** sama struktura gry mierzy technikę — gracz zadający złe pytania nie zdobywa faktów. Nie da się „przegadać" symulatora; można go tylko dobrze przesłuchać.
- **Raport (60/20/20):** punktacja za odkryte przyczyny źródłowe (60 pkt; punkty tylko za przyczynę, nie objaw), za odrzucenie fałszywych tropów (20 pkt; kary za powtórzenie cudzej narracji jako faktu) i za rekomendacje adresujące przyczyny (20 pkt).
- **Debrief (metapoznawczo):** AI pokazuje, czego gracz *nie* odkrył i **jakie pytanie by to odblokowało**. To domyka pętlę uczenia: użytkownik widzi nie tylko wynik, ale konkretną lukę w swojej technice — i ma powód do ponownej rozgrywki.

Miarą sukcesu narzędzia jest różnica wyników między rozgrywkami tego samego użytkownika na **kolejnych scenariuszach** — rośnie technika, nie znajomość odpowiedzi. Drabinka trudności i modyfikatory dają tej progresji przestrzeń: od BILBORDU (proste łańcuchy) do KONSORCJUM (zmowa, świadkowie dokumentowi).

## 6. Wnioski z iteracji — jak zmieniało się podejście

**Iteracja 1 — „zbyt usłużny świadek".** Pierwsza wersja miała tylko opisy postaci i ich sekretów. Efekt: model był zbyt chętny do pomocy — postacie przyznawały się po dwóch ogólnych pytaniach, gra kończyła się w 5 minut i niczego nie uczyła. **Zmiana:** jawne *warunki odblokowania* („przyznaje się TYLKO gdy…") oraz reguła, że pytania ogólne dostają narrację, a nie fakty.

**Iteracja 2 — „karykatury zamiast ludzi".** Po usztywnieniu reguł postacie stały się przerysowane: PM kłamał we wszystkim, gra była frustrująca i nieuczciwa. **Zmiana:** sekcja „częściowo ma rację" dla każdej postaci i zasada „kłamią przez pomijanie, rzadko wprost". Doszedł też limit pytań — bez niego gracze „skanowali" postacie zamiast myśleć strategicznie.

**Iteracja 3 — „wykład zamiast gry".** Model wtrącał metakomentarze edukacyjne w trakcie śledztwa („zauważ, że zadałeś pytanie zamknięte…"), co zabijało immersję. **Zmiana:** twardy zakaz wychodzenia z roli; cała dydaktyka przeniesiona do debriefu — i dotyczy konkretnej rozgrywki gracza, nie teorii.

**Iteracja 4 — „ocena z sufitu".** Debrief bywał uznaniowy i miękki. **Zmiana:** sztywna rubryka 60/20/20 przypięta do zamkniętej listy przyczyn oraz obowiązkowy punkt „czego nie odkryłeś i jakie pytanie by to odblokowało". Ocena stała się powtarzalna i falsyfikowalna.

**Iteracja 5 — „monolit kontra limit platformy".** Pełny prompt przekroczył limit 8 000 znaków instrukcji Custom GPT. Wymuszone rozbicie na silnik + pliki scenariuszy okazało się lepsze projektowo: silnik jest raz dopracowany, a nowy scenariusz to jeden plik według szablonu — treść oddzielona od mechaniki jak dane od kodu. Ograniczenie platformy poprawiło architekturę.

**Iteracja 6 — „druga rozgrywka jest nudna".** Gracz znający ukrytą prawdę scenariusza nie miał po co grać ponownie. **Zmiana:** dwie warstwy — biblioteka scenariuszy z drabinką trudności (każdy poziom dodaje mechanikę: kozioł ofiarny, świadek-plotkarz, zmowa) oraz talia losowych modyfikatorów, które zmieniają przebieg śledztwa, nie zmieniając prawdy. Regrywalność bierze się z techniki, nie z pamięci.

## 7. Wykonanie

- **Custom GPT:** `gpt/gpt-master-prompt.md` (Instructions, ~6,4 tys. znaków) + pliki wiedzy: 6 scenariuszy (`scenariusz-01…06`), `modyfikatory.md`, `szablon-scenariusza.md`.
- **Prototyp HTML:** `sekcja-zwlok.html` — samodzielna aplikacja (jeden plik, zero backendu): wybór rozmówcy, licznik pytań, fazy raportu i debriefu; klucz API użytkownika (Anthropic lub OpenAI) pozostaje w pamięci przeglądarki. Scenariusz FENIKS wbudowany.
- **Prompt referencyjny:** `system-prompt.md` — pełna wersja jednoplikowa (FENIKS), działa po wklejeniu do dowolnego czatu LLM.

## 8. Plan screencastu (3–4 min)

1. **(20 s)** Problem: post-mortemów nie da się ćwiczyć na sucho. Ekran startowy / lista scenariuszy w GPT.
2. **(60 s)** Rozgrywka (FENIKS): rozmowa z Markiem (narracja o „trudnym kliencie"), przełączenie na Tomka → e-mail ostrzegawczy → powrót do Marka i konfrontacja → przyznanie się do zielonych statusów. Jedno pełne „odblokowanie" na ekranie.
3. **(40 s)** Serce narzędzia: architektura silnik + scenariusze; fragment karty postaci z warunkami odblokowania; jedno zdanie o tym, czemu nagroda jest w mechanice, nie w pochwałach.
4. **(40 s)** Raport i debrief: wynik punktowy + „czego nie odkryłeś i jakie pytanie by to odblokowało".
5. **(30 s)** Skalowalność i regrywalność: drabinka 6 scenariuszy (jedno zdanie o zmowie w KONSORCJUM), losowe modyfikatory, wnioski z 6 iteracji w dwóch zdaniach.
