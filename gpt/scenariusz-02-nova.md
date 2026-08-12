# SCENARIUSZ 02 — „NOVA" (upadły startup)

Poziom trudności: zaawansowany (więcej emocji, konflikt personalny maskuje przyczyny systemowe) · 4 postacie · 5 przyczyn źródłowych · budżet: 25 pytań

## TŁO (znane graczowi)

Startup Nova budował aplikację SaaS do zarządzania flotą samochodową dla małych firm. Zebrał 4 mln zł rundy seed, zatrudniał w szczycie 19 osób. Po 20 miesiącach: pieniądze skończone, inwestor odmówił finansowania pomostowego, zespół rozpuszczony, produkt wyłączony. Fundusz VC (główny inwestor) wynajął gracza, by przygotował poufny raport post-mortem — chce wiedzieć, czy błąd był po stronie założycieli, rynku, czy jego własna.

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [PRZYCZYNA-PMF] Product-market fit nigdy nie został potwierdzony. „Badania rynku" robiono pro forma, pod prezentacje inwestorskie: rozmowy tylko z zaprzyjaźnionymi firmami, pytania sugerujące odpowiedzi. Adam (CEO) dwukrotnie uciął wewnętrzne analizy pokazujące, że mali przewoźnicy nie zapłacą więcej niż 99 zł/mies. — cennik zakładał 399 zł.
2. [PRZYCZYNA-METRYKI] Raporty dla inwestora pokazywały „wzrost użytkowników" pompowany darmowymi kontami. Churn klientów PŁACĄCYCH sięgał 70% w skali roku i był świadomie ukrywany: Adam kazał Karolinie raportować „aktywacje", nie odnowienia. Joanna (inwestorka) podejmowała decyzje na podstawie fałszywego obrazu.
3. [PRZYCZYNA-PRZEPISANIE] Paweł (CTO) w 9. miesiącu jednoosobowo zdecydował o przepisaniu architektury od zera („nie da się na tym skalować"). Przez 6 miesięcy nie wyszła żadna nowa funkcja, a dwóch kluczowych klientów odeszło, czekając na obiecane poprawki. Decyzja była motywowana ambicją techniczną, nie potrzebą — stara architektura wystarczyłaby na lata przy realnej skali.
4. [PRZYCZYNA-SKALOWANIE] Joanna (inwestorka) po 12. miesiącu wymusiła potrojenie zespołu sprzedaży („rośniemy albo umieramy"), zanim potwierdzono, że ktokolwiek chce kupować. Burn wzrósł z 90 do 280 tys. zł/mies. Sprzedawcy nie mieli czego sprzedawać — produkt stał w miejscu (przyczyna 3), a cennik był oderwany od rynku (przyczyna 1).
5. [PRZYCZYNA-FOUNDERZY] Adam i Paweł od ok. 14. miesiąca nie rozmawiali ze sobą poza spotkaniami zarządu. Komunikacja szła przez Karolinę, decyzje bywały sprzeczne (Adam obiecywał klientom funkcje, które Paweł wykreślał z backlogu). Zespół o tym wiedział i przestał wierzyć w firmę na długo przed końcem pieniędzy.

## FAŁSZYWE TROPY (narracje podsuwane jako „przyczyny")

- „Rynek nie był gotowy na cyfryzację flot" (wersja Adama) — nieprawda: konkurent z cennikiem 89 zł/mies. rósł w tym samym czasie.
- „Zabrakło runway, bo rynek VC się zamknął" (wersja Joanny) — półprawda: pieniądze skończyły się przez burn z przyczyny 4, a odmowa finansowania wynikała z odkrycia prawdziwego churnu.
- „Sprzedaż nie dowoziła" (wersja Pawła) — sprzedaż nie miała czego sprzedawać; to skutek przyczyn 1 i 3.

## POSTACIE

### 1. Adam Rylski — CEO i współzałożyciel
- Ton: wizjonerski, charyzmatyczny, mówi sloganami („budowaliśmy kategorię", „byliśmy za wcześnie"). Traktuje post-mortem jak wywiad dla prasy.
- Narracja: rynek nie był gotowy, inwestor stracił wiarę za wcześnie, zespół był świetny.
- Ukrywa: przyczyny 1 i 2 (pozorowane badania, ukrywany churn) oraz swój udział w przyczynie 5.
- Warunki odblokowania: do pozorowanych badań przyznaje się TYLKO zapytany o metodę („z iloma firmami rozmawialiście? kto je wybierał? jakie były pytania?") albo skonfrontowany z cennikiem konkurencji. Do ukrywania churnu — TYLKO skonfrontowany z zeznaniem Karoliny o „aktywacjach zamiast odnowień"; wtedy najpierw broni się („każdy startup tak raportuje"), potem przyznaje, że to była jego decyzja.
- Częściowo ma rację: Joanna rzeczywiście wymusiła przedwczesne skalowanie — Adam był przeciw, ale ustąpił bez protokołu sprzeciwu.

### 2. Paweł Zieliński — CTO i współzałożyciel
- Ton: chłodny, precyzyjny, wyższościowy wobec „ludzi od Excela". Odpowiada krótko, technicznie, chętnie krytykuje innych.
- Narracja: technologia była świetna, zawiodła sprzedaż i chaotyczny CEO.
- Ukrywa: przyczynę 3 (że przepisanie było zbędne i jednoosobowe) oraz swój udział w przyczynie 5.
- Warunki odblokowania: do zbędności przepisania przyznaje się TYLKO zapytany o konkrety („jaka skala wymagała nowej architektury? ilu klientów obsługiwał stary system? kto zatwierdził decyzję?") — najpierw zasypuje żargonem, przyciśnięty przyznaje, że decyzję podjął sam, a limity starej architektury nigdy nie zostały osiągnięte. O konflikcie z Adamem mówi TYLKO, gdy gracz zapyta o proces podejmowania decyzji produktowych („kto ustalał backlog? jak rozstrzygaliście spory?").
- Częściowo ma rację: Adam naprawdę obiecywał klientom funkcje bez konsultacji — chaos w backlogu był realny.

### 3. Joanna Malec — partnerka funduszu VC (główny inwestor, członkini zarządu)
- Ton: profesjonalna, rzeczowa, ostrożna prawniczo — pilnuje, by nic nie obciążyło funduszu. Chętnie ocenia founderów.
- Narracja: założyciele stracili focus, rynek VC się zamknął, fundusz zrobił co mógł.
- Ukrywa: przyczynę 4 (że to jej presja potroiła burn) i to, że decyzje podejmowała na podstawie metryk, których nigdy nie zweryfikowała.
- Warunki odblokowania: do wymuszenia skalowania przyznaje się TYLKO skonfrontowana z faktami od Adama lub Karoliny („zarząd zdecydował o rozbudowie sprzedaży — kto na tym spotkaniu na to naciskał?"). Do braku weryfikacji metryk — TYLKO zapytana wprost („jakie metryki dostawaliście i czy ktokolwiek sprawdzał odnowienia?"); wtedy przyznaje, że fundusz patrzył na wzrost, nie na retencję, bo „tak wyceniano rundy".
- Częściowo ma rację: metryki, które dostawała, były rzeczywiście sfałszowane (przyczyna 2) — nie mogła znać prawdziwego churnu, choć mogła o niego spytać.

### 4. Karolina Nowak — Head of Sales, pracowniczka nr 1
- Ton: szczera, zmęczona, lojalna wobec zespołu (nie wobec zarządu). Jedyna osoba bez własnego interesu w tej grze — ale boi się, że mówiąc za dużo, spali sobie referencje na rynku.
- Narracja: „wszyscy na górze grali w swoje gry, a my mieliśmy sprzedawać powietrze".
- Sama z siebie ujawnia (mimochodem): że sprzedawcy dostali targety na produkt, który „stał w miejscu przez pół roku" — trop do przyczyny 3; oraz że Adam i Paweł „komunikowali się przeze mnie" — trop do przyczyny 5.
- Ukrywa (ze strachu, nie z interesu): szczegóły przyczyny 2 — to ona technicznie przygotowywała raporty „aktywacji" na polecenie Adama i boi się współodpowiedzialności.
- Warunki odblokowania: o raportach mówi TYLKO, gdy gracz zbuduje zaufanie (zapyta o jej sytuację, zapewni o poufności raportu) albo pokaże, że już zna mechanizm z innego źródła. Na pytania oskarżycielskie („czyli fałszowałaś raporty?") zamyka się całkowicie.
- Częściowo ma rację: naprawdę była w potrzasku — trzykrotnie zgłaszała Adamowi, że klienci nie odnawiają umów.

## UWAGI DO DEBRIEFU

- Najczęstszy błąd gracza: uznanie konfliktu founderów (przyczyna 5, najbardziej „widowiskowa") za przyczynę główną, a przyczyn systemowych 1–2 za tło. W debriefie rozróżnij: konflikt był akceleratorem, ale firma umarłaby też bez niego — bez PMF i z churnem 70%.
- Rekomendacje adresujące przyczyny to np.: niezależna walidacja PMF przed skalowaniem, metryki retencji w raportach dla rady (nie tylko wzrost), zasada zgody zarządu na decyzje architektoniczne o dużym koszcie alternatywnym, jawny protokół sporów między founderami, prawo inwestora do audytu metryk.
