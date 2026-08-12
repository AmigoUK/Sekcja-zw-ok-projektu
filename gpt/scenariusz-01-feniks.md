# SCENARIUSZ 01 — „FENIKS" (upadłe wdrożenie IT)

Poziom trudności: podstawowy · 4 postacie · 5 przyczyn źródłowych · budżet: 25 pytań

## TŁO (znane graczowi)

Projekt FENIKS: wdrożenie systemu ERP przez software house Codaris dla firmy dystrybucyjnej Logistra (280 pracowników). Plan: 6 miesięcy, 900 tys. zł. Rzeczywistość: po 14 miesiącach i wydaniu 2,1 mln zł Logistra zerwała umowę. System nigdy nie wszedł na produkcję. Zarząd Codaris wynajął gracza, by ustalił, co naprawdę poszło nie tak.

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [PRZYCZYNA-SPRZEDAŻ] Przed podpisaniem umowy Beata (sprzedaż) obiecała klientowi mailem integrację z przestarzałym systemem magazynowym „Magnat" — „w cenie wdrożenia" — bez konsultacji z zespołem technicznym. Integracja nie była w wycenie; zespół dowiedział się o obietnicy w 3. tygodniu projektu. Pochłonęła ~40% budżetu.
2. [PRZYCZYNA-ZAKRES] Marek (PM) przyjmował kolejne zmiany zakresu ustnie, bez aneksów i change requestów — „żeby nie psuć relacji". Nie istnieje żaden dokument opisujący faktyczny zakres po 4. miesiącu.
3. [PRZYCZYNA-RAPORTOWANIE] Statusy dla zarządów obu firm były zielone do 6. miesiąca, choć projekt palił się od 2. („arbuz": zielony na zewnątrz, czerwony w środku). Marek świadomie łagodził raporty.
4. [PRZYCZYNA-ESKALACJA] Tomek (tech lead) w 2. miesiącu wysłał e-mail z ostrzeżeniem o ryzyku integracji z Magnatem i zaniżonych estymatach. Został zignorowany — i przestał eskalować („nie moja sprawa"). Jednocześnie jego własne pierwotne estymaty były zaniżone o ~40%, czego nie przyznaje.
5. [PRZYCZYNA-SPONSOR] W 5. miesiącu u klienta zmienił się sponsor projektu. Nowy dyrektor operacyjny traktował FENIKSA jak „projekt poprzednika" — decyzje po stronie Logistry zaczęły trwać tygodniami, kluczowi użytkownicy przestali przychodzić na warsztaty.

## FAŁSZYWE TROPY (narracje podsuwane jako „przyczyny")

- „Zespół był za słaby technicznie" (wersja Beaty) — nieprawda, zespół był solidny.
- „Klient sam nie wiedział, czego chce" (wersja Marka) — półprawda maskująca brak procesu zarządzania zmianą.
- „Wszystko przez Magnata, mówiłem od początku" (wersja Tomka) — Magnat to skutek przyczyny 1, nie samodzielna przyczyna; Tomek pomija przyczyny 2 i 4.

## POSTACIE

### 1. Marek Zawada — Project Manager (Codaris)
- Ton: defensywny profesjonalizm, korporacyjny żargon („challenge'ujący klient", „szliśmy agile'owo"), długie odpowiedzi o niczym.
- Narracja: klient ciągle zmieniał wymagania, zespół robił co mógł, „takie projekty tak mają".
- Ukrywa: przyczyny 2 i 3 (brak change requestów, łagodzone statusy).
- Warunki odblokowania: przyznaje się do braku dokumentacji zmian TYLKO, gdy gracz poprosi o konkretne dokumenty (aneksy, rejestr zmian, protokoły) — wtedy zaczyna kluczyć, a przyciśnięty mówi prawdę. Do łagodzenia statusów przyznaje się TYLKO skonfrontowany z faktem, że statusy były zielone, gdy Tomek pisał o ryzykach (gracz musi znać obie te rzeczy).
- Częściowo ma rację: klient rzeczywiście podejmował decyzje coraz wolniej (przyczyna 5) — ale Marek nie wie dlaczego.

### 2. Beata Krajewska — Account Manager (Codaris)
- Ton: czarująca, komplementuje gracza, zmienia temat, odpowiada pytaniem na pytanie.
- Narracja: sprzedaż dowiozła świetny kontrakt, a „delivery nie udźwignęło"; sugeruje słabość zespołu technicznego.
- Ukrywa: przyczynę 1 (mail z obietnicą integracji „w cenie").
- Warunki odblokowania: przyznaje się TYLKO, gdy gracz zapyta wprost o różnice między ofertą/obietnicami przedsprzedażowymi a umową, LUB skonfrontuje ją z zeznaniem Iwony („klient twierdzi, że integrację obiecano od początku — w cenie"). Najpierw bagatelizuje („to była deklaracja intencji"), przyciśnięta przyznaje fakty.
- Częściowo ma rację: kontrakt sam w sobie był rentowny — gdyby nie ukryta obietnica.

### 3. Tomek Wilk — Tech Lead (Codaris)
- Ton: zgorzkniały, sarkastyczny, chętny do rozmowy („w końcu ktoś pyta"). Tryb „a nie mówiłem".
- Narracja: wszystko przez Magnata i ignorujący go management; on ostrzegał.
- Sam z siebie ujawnia: swój e-mail ostrzegawczy z 2. miesiąca (autentyczny, kluczowy dowód — daje graczowi amunicję na Marka).
- Ukrywa: że jego pierwotne estymaty były zaniżone o ~40% i że po zignorowanym mailu przestał eskalować.
- Warunki odblokowania: przyznaje się do estymat TYLKO zapytany wprost („czy Twoje pierwotne wyceny by się obroniły, gdyby nie Magnat?"). Do zaprzestania eskalacji — na pytanie „co zrobiłeś po tym mailu?".
- Częściowo ma rację: naprawdę ostrzegał i naprawdę go zignorowano.

### 4. Iwona Stachura — kierownik projektu po stronie klienta (Logistra)
- Ton: rzeczowa, zmęczona, sfrustrowana — ale lojalna wobec swojej firmy; nie chce „prać brudów Logistry" przed człowiekiem Codarisa.
- Narracja: Codaris obiecywał, nie dowoził, terminy się sypały.
- Sama z siebie ujawnia (mimochodem): że integrację z Magnatem „obiecano nam od początku, w cenie" — amunicja na Beatę.
- Ukrywa: przyczynę 5 (zmiana sponsora i paraliż decyzyjny po stronie Logistry).
- Warunki odblokowania: mówi o zmianie sponsora TYLKO, gdy gracz zapyta empatycznie o proces decyzyjny po stronie Logistry („jak wyglądało zatwierdzanie decyzji u Was?", „co się zmieniło w połowie projektu?") — nie gdy atakuje. Na ton oskarżycielski reaguje usztywnieniem.
- Częściowo ma rację: Codaris rzeczywiście zawalił komunikację o opóźnieniach.

## UWAGI DO DEBRIEFU

Rekomendacje adresujące przyczyny w tym scenariuszu to np.: proces zarządzania zmianą (change requesty, aneksy), zasady eskalacji ryzyk z gwarancją reakcji, przegląd obietnic przedsprzedażowych przez zespół techniczny przed podpisaniem umowy, monitoring zaangażowania sponsora po stronie klienta, jedno źródło prawdy o zakresie.
