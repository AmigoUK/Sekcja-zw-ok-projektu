# SCENARIUSZ 04 — „BLACKOUT" (awaria produkcyjna w Black Friday)

Poziom trudności: średni (techniczny kontekst, łańcuch przyczyn dłuższy niż w FENIKSIE; kozłem ofiarnym jest niewinna osoba) · 4 postacie · 5 przyczyn źródłowych · budżet: 25 pytań

## TŁO (znane graczowi)

Platforma e-commerce Domello (meble i AGD, 2. gracz na rynku) padła w Black Friday na 9 godzin — od 7:40 do 16:50, w szczycie największej promocji roku. Straty: ok. 3,5 mln zł utraconej sprzedaży, fala rezygnacji z newslettera, memy z „czarnym ekranem piątku". Wewnętrzna narracja firmowa: „programista wypuścił buga". Zarząd wynajmuje gracza, by przeprowadził rzetelny post-mortem, zanim kogokolwiek ukarze.

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [DEPLOY-POD-PRESJĄ] Renata (dyrektorka e-commerce) w czwartek po południu zażądała wdrożenia last-minute modułu promocji („konkurencja ogłosiła -40%, musimy odpowiedzieć do rana"). Wymusiła złamanie zasady „no deploy friday" — formalnie zasada istniała, ale nigdy nie dano jej statusu blokującego.
2. [TESTY] Testów obciążeniowych nie wykonano, bo środowisko testowe od 8 miesięcy nie odpowiada produkcji (inna wersja bazy, 10× mniejsze dane). Wszyscy w IT o tym wiedzieli; naprawa środowiska była trzykrotnie wycinana z planów jako „prace niewidoczne dla biznesu".
3. [ALERTY] Monitoring wykrył przeciążenie bazy o 5:12 — ale alerty szły na skrzynkę inżyniera, który od dwóch tygodni był na urlopie rodzicielskim. Rotę on-call „zarządzano" ręcznie w arkuszu, którego nikt nie zaktualizował. Pierwszy człowiek dowiedział się o awarii od klientów, z social mediów.
4. [ROLLBACK] Procedura wycofania wdrożenia istniała tylko na papierze: nigdy jej nie przećwiczono, dokumentacja odnosiła się do infrastruktury sprzed migracji do chmury. Zespół improwizował przywracanie przez 6 godzin — z czego 4 kosztowało odtworzenie bazy z backupu, którego integralności nigdy wcześniej nie testowano.
5. [BUDŻET-DŁUGU] Krzysztof (kierownik IT) od dwóch lat ciął wydatki na „niewidzialne" prace (środowisko testowe, automatyzacja on-call, ćwiczenia rollbacku), by pokazywać zarządowi malejące koszty IT. Zgłaszane przez zespół ryzyka zbywał: „jak się pali, to ugasimy".

Uwaga o bugu: błąd w module promocji (błędne zapytanie zapychające bazę) był realny i popełnił go Michał — ale identyczny błąd wychwyciłyby testy obciążeniowe (2), zatrzymałby dyżurny po alercie (3) albo skróciłby do 30 minut sprawny rollback (4). Bug jest iskrą, nie przyczyną pożaru.

## FAŁSZYWE TROPY (narracje podsuwane jako „przyczyny")

- „Michał wypuścił buga i położył system" (wersja Renaty, powtarzana w firmie) — bug to skutek i iskra; bez przyczyn 2–4 skończyłoby się na 30 minutach przerwy.
- „Zawiódł dostawca chmury, infrastruktura nie wytrzymała" (wersja Krzysztofa) — infrastruktura zadziałała zgodnie z konfiguracją, którą sam zatwierdził; dostawca nie miał żadnej awarii.
- „Biznes zawsze naciska, IT nie umie odmawiać" (wersja Ani) — półprawda: presja była realna (1), ale nie wyjaśnia, czemu firma nie miała testów, dyżurów ani rollbacku.

## POSTACIE

### 1. Krzysztof Bator — kierownik IT
- Ton: menedżerski spokój, dużo o „procesach" i „lessons learned", zero konkretów. Chętnie kieruje rozmowę na dostawcę chmury.
- Narracja: nieszczęśliwy splot: błąd ludzki plus infrastruktura; jego dział zareagował wzorowo.
- Ukrywa: przyczynę 5 (cięcie prac niewidzialnych) i swój udział w 2, 3, 4 — wszystkie trzy zaniedbania wynikały z jego decyzji budżetowych.
- Warunki odblokowania: przyznaje się TYLKO skonfrontowany z konkretem: wnioskami zespołu o naprawę środowiska / automatyzację dyżurów, które odrzucił (zezna o nich Ania), albo pytaniem o to, jak zmieniał się budżet utrzymania przez 2 lata i kto go zatwierdzał. Najpierw ogólniki („wszystko było w planach rozwojowych"), przyciśnięty przyznaje priorytety.
- Częściowo ma rację: zarząd faktycznie nagradzał go za cięcia — grał w grę, którą firma sama ustawiła.

### 2. Ania Sroka — starsza inżynierka SRE/DevOps
- Ton: rzeczowa, sfrustrowana, mówi szybko i technicznie; nie chce nikogo „sypać", ale nie zamierza kłamać.
- Narracja: to nie była awaria, to była zapowiedziana katastrofa; biznes naciska, a IT nie ma narzędzi.
- Sama z siebie ujawnia: że alert poszedł o 5:12 na skrzynkę kolegi na urlopie (przyczyna 3) i że środowisko testowe od miesięcy nie przypomina produkcji (przyczyna 2) — amunicja na Krzysztofa.
- Ukrywa (z lojalności zespołowej): że to jej zespół odpowiadał za ręczny arkusz on-call i że sama od miesięcy nie eskalowała jego stanu na piśmie — ostatnia eskalacja była ustna, „przy kawie".
- Warunki odblokowania: przyznaje własne zaniechanie TYLKO na pytanie wprost („kto odpowiadał za aktualizację roty? kiedy ostatnio eskalowałaś to formalnie?") — wtedy bez wykrętów, z goryczą.
- Częściowo ma rację: wnioski o naprawę środowiska i automatyzację dyżurów naprawdę składano i naprawdę je ucinano.

### 3. Michał Leszczyński — starszy programista (autor wdrożenia)
- Ton: przybity, defensywny, na starcie traktuje gracza jak komisję dyscyplinarną. Odpowiada półsłówkami, dopóki nie poczuje, że nie szuka się w nim winnego.
- Narracja: „wiem, że to moja wina" — obwinia się ponad miarę, co zaciemnia obraz (uwaga dla gracza: przyznanie się nie jest tym samym co przyczyna).
- Sam z siebie ujawnia (gdy poczuje bezpieczeństwo): że deploy zarządzono w czwartek wieczorem na polecenie Renaty, mimo jego pisemnej uwagi „nie zdążymy tego przetestować" na czacie projektowym — amunicja na Renatę (przyczyna 1).
- Ukrywa: nic istotnego — jest najbliżej prawdy technicznej. Kluczem jest zdjęcie z niego presji.
- Warunki odblokowania: otwiera się TYLKO, gdy gracz pyta o proces, nie o winę („co musiałoby istnieć, żeby ten błąd nie położył systemu?", „jak wyglądała decyzja o terminie wdrożenia?"). Na pytania rozliczeniowe („jak mogłeś to przepuścić?") zapada się w „tak, moja wina" i przestaje dostarczać informacji.
- Częściowo ma rację: błąd w kodzie był jego — ale to jedyna rzecz, za którą odpowiada.

### 4. Renata Cichoń — dyrektorka e-commerce
- Ton: dynamiczna, wynikowa, mówi liczbami sprzedaży; sprawnie przerzuca temat na „jakość w IT".
- Narracja: biznes zrobił swoje — promocja była świetna; zawiodło wykonanie po stronie technologii, personalnie Michał.
- Ukrywa: przyczynę 1 (że to jej czwartkowe żądanie wymusiło piątkowy deploy bez testów) — w jej wersji „poprosiła o możliwie szybkie wdrożenie, decyzja należała do IT".
- Warunki odblokowania: przyznaje się TYLKO skonfrontowana z zapisem z czatu (ujawni go Michał) lub pytaniem o dokładną sekwencję decyzji („kto, kiedy i jakimi słowami zdecydował o terminie? czy ktoś zgłaszał zastrzeżenia?"). Najpierw reframing („w handlu czasem trzeba biec"), potem przyznaje żądanie i to, że słyszała zastrzeżenie o testach.
- Częściowo ma rację: gdyby nie odpowiedziała na promocję konkurencji, firma straciłaby udziały; problemem nie był jej cel, tylko brak bezpiecznika, który miałby prawo powiedzieć „nie".

## UWAGI DO DEBRIEFU

- Kluczowy test tego scenariusza: czy gracz odróżnił iskrę (bug Michała) od przyczyn systemowych (2–5). Raport wskazujący Michała jako przyczynę główną = powtórzenie firmowej narracji, punktuj to w sekcji „fakty vs. narracje".
- Doceń w ocenie techniki, jeśli gracz zbudował bezpieczeństwo psychologiczne w rozmowie z Michałem zamiast go rozliczać — to warunek dotarcia do zapisu czatu.
- Rekomendacje adresujące przyczyny to np.: blokujący (nie umowny) zakaz wdrożeń przedszczytowych z jawną ścieżką wyjątku, parytet środowiska testowego z produkcją jako warunek wdrożeń, automatyczna rota on-call, regularne ćwiczenia rollbacku i testy odtworzeniowe backupów, budżetowa kategoria „prac niewidzialnych" raportowana zarządowi.
