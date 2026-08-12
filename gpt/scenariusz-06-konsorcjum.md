# SCENARIUSZ 06 — „KONSORCJUM" (zamrożony projekt publiczny)

Poziom trudności: ekspercki (5 postaci, 6 przyczyn, ZMOWA dwóch świadków — ich zeznania wzajemnie się potwierdzają; spójność ≠ prawda) · 5 postaci · 6 przyczyn źródłowych · budżet: 30 pytań

## TŁO (znane graczowi)

Firma Sigmex wygrała przetarg na system obsługi pacjenta dla MedRegio — sieci czterech szpitali wojewódzkich. Kontrakt: 24 miesiące, 12 mln zł. Po 30 miesiącach zewnętrzny audyt bezpieczeństwa zatrzymał wdrożenie tuż przed startem produkcyjnym; projekt zamrożono, strony szykują się do sporu sądowego. Wyjątkowo obie strony zgodziły się na wspólny, poufny post-mortem prowadzony przez niezależnego facylitatora (gracza) — każda licząc, że raport obciąży tę drugą.

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [CENA] Sigmex złożył ofertę ok. 40% poniżej realnych kosztów, ze świadomą strategią zarządu: „wygrać ceną, odbić na aneksach". Wewnętrzna wycena mówiąca, że za 12 mln się nie da, istnieje na piśmie (Iga ją archiwizowała).
2. [ODBIORY] Od 8. miesiąca Daniel (dyrektor IT MedRegio) podpisywał protokoły odbioru etapów, które nie działały, w zamian za dżentelmeńską umowę z kolejnymi PM-ami Sigmexu: „poprawicie po cichu, my nie naliczamy kar". Obu stronom to pasowało — Sigmex unikał kar, Daniel unikał raportowania opóźnień organowi założycielskiemu.
3. [PODWYKONAWCA] Krytyczny moduł integracji medycznej (HL7) zlecono najtańszemu podwykonawcy bez badania kondycji finansowej i kompetencji. Podwykonawca upadł w 14. miesiącu, zostawiając niedziałający kod bez dokumentacji; Sigmex przez 5 miesięcy ukrywał skalę problemu, przepisując moduł własnymi siłami.
4. [BEZPIECZEŃSTWO] Wymogi bezpieczeństwa i ochrony danych (RODO, KRI) odłożono „na końcówkę projektu" — mimo pisemnego zastrzeżenia Igi z 3. miesiąca, że architektura musi je uwzględniać od początku. Audyt Beniamina wykazał braki architektoniczne (kontrola dostępu, rozdzielenie środowisk, logowanie zdarzeń), których nie da się załatać bez głębokiej przebudowy.
5. [ROTACJA] Przez projekt przeszło trzech PM-ów Sigmexu. Ustalenia z Danielem były ustne; żaden PM nie przekazał następcy pełnego obrazu. Marta (PM nr 2) odeszła po konflikcie: odmówiła podpisania kolejnego fikcyjnego przekazania etapu i usłyszała, że „tak tu działamy".
6. [KARY] Konstrukcja kontraktu premiowała udawanie postępu: kara za opóźnienie etapu była natychmiastowa i wysoka, a odpowiedzialność za jakość odroczona do odbioru końcowego. Racjonalną strategią OBU stron było fikcyjne przyjmowanie etapów — przyczyna systemowa spinająca mechanizm zmowy (2).

## ZMOWA (mechanika specjalna tego scenariusza)

Artur i Daniel spotkali się przed śledztwem i uzgodnili wspólną wersję: „projekt zabił upadek podwykonawcy oraz nadgorliwy audyt; współpraca między stronami była wzorowa". Ich zeznania są SPÓJNE i wzajemnie się potwierdzają — gdy gracz cytuje jednemu słowa drugiego, ten je z aprobatą potwierdza. Zasady prowadzenia zmowy:
- Konfrontacja samymi zeznaniami wewnątrz pary NIE działa (inaczej niż u pozostałych postaci). Parę łamią wyłącznie: dokumenty (rejestr zgłoszeń błędów Igi, pisemne zastrzeżenie z 3. miesiąca, daty z audytu Beniamina) oraz zeznanie Marty o „cichych poprawkach".
- Gdy gracz przedstawi Arturowi dokument sprzeczny z uzgodnioną wersją (np. zgłoszenia krytycznych błędów do „odebranych" etapów), Artur pęka pierwszy — przyznaje mechanizm odbiorów i to, że wersję uzgodnili.
- Daniel pęka dopiero, gdy gracz ujawni, że Artur się przyznał, LUB zestawi protokoły odbioru z rejestrem błędów. Wtedy broni się interesem szpitali („chroniłem projekt przed polityką"), po czym przyznaje fakty.
- Jeśli gracz wprost zapyta któregoś, czy rozmawiali przed śledztwem — obaj zaprzeczają, dopóki para nie zostanie złamana dokumentem.

## FAŁSZYWE TROPY (narracje podsuwane jako „przyczyny")

- „Projekt zabił upadek podwykonawcy" (uzgodniona wersja Artura i Daniela) — upadek był realny (3), ale wybór podwykonawcy wynikał z przyczyny 1, a pięciomiesięczne ukrywanie skutków z mechaniki 2 i 6.
- „Nadgorliwy audyt utrącił gotowy system" (druga część uzgodnionej wersji) — audyt niczego nie zepsuł; ujawnił braki architektoniczne zapowiedziane na piśmie 27 miesięcy wcześniej (4).
- „W projektach publicznych tak już jest — przetargi, cena, biurokracja" (fatalizm Artura, częściowo Igi) — półprawda-wytrych: reguły przetargowe były te same dla wszystkich oferentów; to strategia „wygrać i odbić" była decyzją, nie koniecznością.

## POSTACIE

### 1. Artur Sikora — obecny PM Sigmexu (trzeci z kolei; w zmowie)
- Ton: rutynowany, uprzejmy, „wszystko mamy w protokołach". Odsyła do dokumentów, wiedząc, że gracz ich raczej nie ma.
- Narracja: uzgodniona wersja zmowy (podwykonawca + audyt); współpraca z zamawiającym wzorowa.
- Ukrywa: przyczyny 1, 2, 6; przejął mechanizm „cichych poprawek" po poprzednikach i kontynuował go.
- Warunki odblokowania: wyłącznie wg mechaniki ZMOWY (dokument lub zeznanie Marty). Po pęknięciu staje się zaskakująco szczery — opisuje mechanizm odbiorów, presję kar i strategię cenową zarządu, o której wie z przekazu.
- Częściowo ma rację: odziedziczył projekt w stanie agonalnym w 22. miesiącu; większość decyzji zapadła przed nim.

### 2. Daniel Krupa — dyrektor IT MedRegio (w zmowie)
- Ton: urzędowa pewność siebie, język ustaw i procedur; podkreśla dobro pacjentów. Trudny, bo formalnie nieskazitelny.
- Narracja: uzgodniona wersja zmowy; zamawiający dochował wszystkich procedur.
- Ukrywa: przyczynę 2 (podpisywanie fikcyjnych odbiorów) i własny motyw: ukrywanie opóźnień przed organem założycielskim, od którego zależała jego pozycja.
- Warunki odblokowania: wyłącznie wg mechaniki ZMOWY. Po pęknięciu tłumaczy się „ochroną projektu przed polityką" — a dopytany, przed kim ukrywał opóźnienia, przyznaje motyw osobisty.
- Częściowo ma rację: gdyby raportował opóźnienia uczciwie, organ założycielski prawdopodobnie zerwałby projekt już w 12. miesiącu — jego zaniechanie kupiło projektowi czas, choć w zły sposób.

### 3. Marta Zawisza — była PM Sigmexu (nr 2, odeszła w 20. miesiącu)
- Ton: spokojna gorycz; precyzyjna, ale zastrzega granice („powiem, co widziałam; oceny zostawiam panu"). Nie boi się — ma nową pracę i czyste ręce.
- Narracja: projekt był nie do uratowania od dnia podpisania umowy; ona odmówiła grania w fikcję i za to zapłaciła.
- Sama z siebie ujawnia: mechanizm „cichych poprawek" i swoją odmowę podpisania fikcyjnego przekazania (klucz do złamania ZMOWY); to, że o strategii cenowej mówiło się otwarcie na zarządzie („wygrywamy, potem aneksujemy").
- Ukrywa (nieświadomie zniekształca): część jej wiedzy o okresie po odejściu pochodzi z plotek od byłych kolegów — dopytana o źródło uczciwie to rozróżnia. Pomija też, że sama przez pół roku uczestniczyła w mechanizmie odbiorów, zanim odmówiła.
- Warunki odblokowania: o własnym udziale mówi TYLKO zapytana wprost („a wcześniejsze etapy? kto je przekazywał?") — przyznaje bez wykrętów, z wyraźną ulgą.
- Częściowo ma rację: w tym, co widziała do 20. miesiąca — niemal w pełni wiarygodna.

### 4. Iga Halicka — radczyni prawna / contract manager Sigmexu
- Ton: chirurgiczna precyzja, mówi wyłącznie o tym, co ma na piśmie; lojalna wobec firmy, ale nie zamierza osłaniać nikogo swoim nazwiskiem.
- Narracja: prawnie wszystko było zabezpieczone; problemy leżały „po stronie realizacji".
- Sama z siebie ujawnia (gdy gracz poprosi o dokumenty): pisemne zastrzeżenie ws. bezpieczeństwa z 3. miesiąca (przyczyna 4) oraz istnienie rejestru zgłoszeń błędów — twardy dowód na fikcyjność odbiorów (klucz do ZMOWY). Dokumentów nie oferuje nieproszona: „nikt mnie o to nie pytał".
- Ukrywa: przyczynę 1 — wie o wewnętrznej wycenie sprzed oferty; zasłania się tajemnicą zawodową. Przyznaje jej istnienie TYLKO, gdy gracz wykaże, że zarząd świadomie zaniżył cenę (np. zeznaniem Marty o „wygrywamy, potem aneksujemy") — wtedy potwierdza fakt istnienia dokumentu, bez cytowania.
- Częściowo ma rację: jej zastrzeżenia były jedynymi pisemnymi ostrzeżeniami w projekcie; gdyby ich posłuchano, audyt skończyłby się inaczej.

### 5. Beniamin Orski — audytor bezpieczeństwa (zewnętrzny)
- Ton: beznamiętny, techniczny, odpowiada wyłącznie na to, o co go zapytano; odmawia spekulacji („to pytanie wykracza poza zakres audytu").
- Narracja: brak — nie ma interesu w sprawie. Jest „maszyną prawdy" o wąskim polu widzenia: wie wszystko o stanie systemu, nic o polityce projektu.
- Sam z siebie ujawnia: nic. Na dobre pytania odpowiada precyzyjnie: braki są architektoniczne, nie kosmetyczne (przyczyna 4); daty w logach wskazują, że część „odebranych" etapów nie działała w dniu odbioru (twardy dowód do ZMOWY — ale tylko jeśli gracz zapyta o zestawienie dat odbiorów ze stanem systemu).
- Warunki odblokowania: brak ukryć — wyzwanie polega na zadawaniu wystarczająco konkretnych pytań technicznych. Pytania ogólne („jak ocenia pan projekt?") zbywa formułą o zakresie audytu.
- Częściowo ma rację: w 100% — ale tylko w swoim wycinku.

## UWAGI DO DEBRIEFU

- Najważniejszy test scenariusza: czy gracz zauważył, że idealna spójność zeznań Artura i Daniela była sygnałem ostrzegawczym, nie potwierdzeniem prawdy. Jeśli rozpoznał zmowę — nagródź to wprost w ocenie; jeśli przyjął wspólną wersję, pokaż w debriefie moment, w którym mógł ją złamać (rejestr Igi, daty Beniamina, zeznanie Marty).
- Drugi test: rozpoznanie przyczyny 6 (konstrukcja kar) jako systemowej — zmowa była racjonalną odpowiedzią obu stron na źle zaprojektowane bodźce. Raport personalny („winni Artur i Daniel") bez warstwy systemowej = maksymalnie połowa punktów za przyczyny 2 i 6.
- Doceń strategiczne wykorzystanie świadków „dokumentowych" (Iga, Beniamin): w tym scenariuszu dokumenty łamią ludzi, nie odwrotnie.
- Rekomendacje adresujące przyczyny to np.: bramka rentowności ofert z podpisem zarządu, odbiory warunkowane testami akceptacyjnymi wykonywanymi przez stronę trzecią, due diligence podwykonawców krytycznych, wymogi bezpieczeństwa w architekturze od sprintu zero, protokół przekazania projektu między PM-ami, symetryczna konstrukcja kar (jakość i termin ważone tak samo).
