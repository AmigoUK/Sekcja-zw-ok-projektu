# Grafiki do scenariuszy branżowych — lista plików i prompty

Uzupełnienie [`prompty-grafiki.md`](prompty-grafiki.md): ten sam styl (polski komiks kryminalny lat 70.), te same uwagi techniczne per generator i ta sama zasada praw autorskich. Tu są postacie nowych spraw (CHŁODNIA, SEZAM, WYCIEK), opcjonalne grafiki dla scenariuszy 02–06 i okładki spraw.

Gra działa bez żadnego z tych plików: brak portretu = inicjały na kolorze, brak wariantu emocji = dymek bez obrazka. Można więc dokładać grafiki stopniowo.

## Konwencja plików

| Co | Ścieżka | Format |
|---|---|---|
| Portret (wariant neutralny) | `img/<id>/<slug>.png` | 1:1, generuj 1024×1024, zapisz 384×384 |
| Wariant emocji | `img/<id>/emocje/<slug>-<emocja>.jpg` | 1:1, zapisz 768×768 |
| Okładka sprawy | `img/<id>/okladka.jpg` | 2:3 |

`<id>` i `<slug>` to małe litery bez polskich znaków: `CHLODNIA` → `chlodnia`, `Grażyna` → `grazyna`. Emocje: `radosc`, `zlosc`, `zaskoczenie`, `smutek`, `rezygnacja`.

FENIKS zostaje w dotychczasowych ścieżkach (`img/marek.png`, `img/emocje/marek-zlosc.jpg` itd.).

## Które emocje są naprawdę potrzebne

Gra pokazuje tylko emocje z łuku strategii postaci oraz `zaskoczenie` (każda konfrontacja). Reszta jest zapasem na wypadek zmiany strategii — dorabiaj ją, jeśli generujesz w jednej sesji i to nic nie kosztuje.

| Strategia | Wymagane | Zapas |
|---|---|---|
| `unika` | smutek, zaskoczenie, rezygnacja | radość, złość |
| `czaruje` | radość, zaskoczenie, złość | smutek, rezygnacja |
| `zgorzknialy` | radość, złość, rezygnacja, zaskoczenie | smutek |
| `zmeczony` | smutek, rezygnacja, złość, zaskoczenie | radość |
| `agresywny` | złość, rezygnacja, zaskoczenie | radość, smutek |

## Prompt bazowy stylu

Doklejany na końcu każdego promptu postaci (w promptach niżej oznaczony jako `[baza stylu]`) — identyczny jak w `prompty-grafiki.md`:

> bold black ink outlines, flat limited color palette (mustard yellow, brick red, teal, cream paper), visible halftone dots, slightly faded offset print, dramatic noir side lighting, retro comic panel, head and shoulders composition —no photorealism, no 3d render, no manga —ar 1:1 --style raw

Każdy prompt postaci zaczyna się od: `1970s Polish crime comic style portrait of …`. Tło i rekwizyty są stylizowane na lata 70. także w sprawach współczesnych — tak jak terminal Tomka w FENIKSIE. Anachronizm jest częścią estetyki, nie błędem.

## Jak robić warianty emocji

Najpierw portret neutralny. Warianty generuj **z niego** jako obrazu referencyjnego, a nie od zera — inaczej wyjdzie inna twarz:

- **Midjourney:** `--cref <url-portretu> --cw 100` + `--seed` portretu.
- **ChatGPT / DALL-E:** wgraj portret i poproś o edycję: „the same character, same framing, same background and props, change only the facial expression to …”.
- **Stable Diffusion / Flux:** img2img z portretu, denoise 0,35–0,45, albo IP-Adapter / InstantID z portretem jako referencją.

Fragment doklejany do promptu wariantu (zamiast opisu wyrazu twarzy z portretu):

| Emocja | Fragment EN | Opis PL |
|---|---|---|
| `radosc` | broad, slightly too eager smile, raised cheeks, eyes crinkled | szeroki, odrobinę zbyt chętny uśmiech |
| `zlosc` | furrowed brows, clenched jaw, narrowed eyes, flared nostrils | ściągnięte brwi, zaciśnięta szczęka |
| `zaskoczenie` | raised eyebrows, widened eyes, mouth slightly open, caught off guard | uniesione brwi, szeroko otwarte oczy, przyłapanie |
| `smutek` | downcast eyes, drooping mouth corners, slumped shoulders | spuszczony wzrok, opadnięte kąciki ust |
| `rezygnacja` | blank tired stare, half-closed eyelids, exhaled sigh, shoulders dropped | pusty, zmęczony wzrok, westchnienie, opuszczone ramiona |

Szablon wariantu:

> the same character as in the reference image, identical clothing, props, framing and background, only the facial expression changes: **[fragment EN]**, 1970s Polish crime comic style, bold black ink outlines, flat limited palette, halftone dots, faded offset print —ar 1:1 --style raw

---

## CHŁODNIA 🇵🇱 — `img/chlodnia/`

Wspólne tło serii: kuchnia cateringowa z lat 70. — wielkie aluminiowe garnki, kafelki, zaparowane okienko, metalowe blaty. Akcenty kolorystyczne trzymają się palety awatarów w grze.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `ryszard.png` | Ryszard Mazur — właściciel firmy | `agresywny` | ceglasty |
| `halina.png` | Halina Sobczak — kierowniczka kuchni | `unika` | musztardowy |
| `kuba.png` | Kuba Nowicki — kucharz | `zmeczony` | morski |
| `dorota.png` | Dorota Kmieć — konsultantka HACCP | `czaruje` | niebieski |

### Ryszard Mazur — właściciel (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a heavy-set 55-year-old catering business owner, thick moustache, receding hair, rolled shirt sleeves over strong forearms, leaning forward with fists on a steel counter, defiant hostile glare, calculator and stack of invoices beside him, catering kitchen with large aluminium pots behind, brick red accent, [baza stylu]

**PL:** krępy 55-letni właściciel firmy cateringowej, gęste wąsy, zakola, podwinięte rękawy koszuli, pochyla się nad stalowym blatem z pięściami opartymi o blat, wrogie, buntownicze spojrzenie, obok kalkulator i plik faktur, za nim kuchnia z aluminiowymi garami.

### Halina Sobczak — kierowniczka kuchni (unika)
**EN:**
> 1970s Polish crime comic style portrait of a 50-year-old head cook in a white chef's coat and hairnet, round face, eyes glancing sideways away from the viewer, lips pressed together, holding a clipboard with temperature logs against her chest, steaming pots and tiled wall behind, mustard yellow accent, [baza stylu]

**PL:** 50-letnia kierowniczka kuchni w białym kitlu i siatce na włosach, okrągła twarz, wzrok uciekający w bok, zaciśnięte usta, przyciska do piersi podkładkę z kartami temperatur, za nią parujące gary i kafelki.

### Kuba Nowicki — kucharz (zmęczony)
**EN:**
> 1970s Polish crime comic style portrait of an exhausted 23-year-old cook, messy hair under a paper cook's cap, dark circles under eyes, stained apron, sitting on an upturned crate holding an old mobile phone loosely in one hand, walk-in cold room door with frost behind him, teal accent, [baza stylu]

**PL:** wyczerpany 23-letni kucharz, potargane włosy pod papierową czapką, cienie pod oczami, poplamiony fartuch, siedzi na odwróconej skrzynce, w dłoni luźno trzyma stary telefon komórkowy, za nim drzwi chłodni ze szronem.

### Dorota Kmieć — konsultantka HACCP (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a polished 40-year-old food safety consultant, neat blonde 70s bob, tailored blazer with a brooch, warm professional smile that doesn't reach her eyes, holding a glossy binder labeled "HACCP" like a trophy, office desk with a typewriter and a rubber stamp, blue accent, [baza stylu]

**PL:** zadbana 40-letnia konsultantka ds. bezpieczeństwa żywności, gładki blond bob w stylu lat 70., dopasowany żakiet z broszką, ciepły profesjonalny uśmiech, który nie sięga oczu, trzyma błyszczący segregator „HACCP” jak trofeum, biurko z maszyną do pisania i pieczątką.

---

## SEZAM 🇬🇧 — `img/sezam/`

Wspólne tło serii: mała polska piekarnia w angielskim mieście lat 70. — piec z cegły, drewniane tace z bułkami, witryna z napisem po angielsku, szyld „Polish Bakery”.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `grazyna.png` | Grażyna Wójcik — właścicielka | `unika` | musztardowy |
| `kasia.png` | Kasia Dąbrowska — kierowniczka produkcji | `czaruje` | ceglasty |
| `darek.png` | Darek Kowal — piekarz nocnej zmiany | `zgorzknialy` | morski |
| `priya.png` | Priya Shah — obsługa sali | `zmeczony` | niebieski |

### Grażyna Wójcik — właścicielka (unika)
**EN:**
> 1970s Polish crime comic style portrait of a 58-year-old Polish bakery owner living in England, permed greying hair, reading glasses on a chain, cardigan over a floral blouse, looking down at an open ledger instead of at the viewer, a framed hygiene rating certificate on the wall behind her, shop counter with bread baskets, mustard yellow accent, [baza stylu]

**PL:** 58-letnia właścicielka polskiej piekarni w Anglii, siwiejąca trwała, okulary do czytania na łańcuszku, kardigan na kwiecistej bluzce, patrzy w otwartą księgę rachunkową zamiast na rozmówcę, na ścianie za nią oprawiony certyfikat oceny higieny, lada z koszami chleba.

### Kasia Dąbrowska — kierowniczka produkcji (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a confident 34-year-old bakery production manager, high ponytail, white bakery jacket with rolled sleeves, bright disarming smile, head tilted, holding a tray of seeded bread rolls toward the viewer as if offering them, label printer and sticker rolls on the bench behind, brick red accent, [baza stylu]

**PL:** pewna siebie 34-letnia kierowniczka produkcji, wysoki kucyk, biała bluza piekarska z podwiniętymi rękawami, rozbrajający uśmiech, przechylona głowa, podsuwa tacę bułek z posypką, jakby częstowała, za nią drukarka etykiet i rolki naklejek.

### Darek Kowal — piekarz nocnej zmiany (zgorzkniały)
**EN:**
> 1970s Polish crime comic style portrait of a 45-year-old night-shift baker, flour on his forearms and stubble, white vest and baker's cap, arms crossed, one eyebrow raised in an "I told you so" smirk, an open sack of seed topping mix with a new supplier label beside him, brick oven glowing behind, teal accent, [baza stylu]

**PL:** 45-letni piekarz z nocnej zmiany, mąka na przedramionach i na zaroście, biały podkoszulek i czapka piekarska, skrzyżowane ręce, uniesiona brew i uśmieszek „a nie mówiłem”, obok otwarty worek posypki z nową etykietą dostawcy, za nim żarzący się piec.

### Priya Shah — obsługa sali (zmęczona)
**EN:**
> 1970s Polish crime comic style portrait of a weary 28-year-old British-Indian shop assistant, dark hair in a low bun, bakery apron over a plain jumper, tired worried eyes, holding a printed sandwich label between two fingers, glass display counter with wrapped sandwiches behind her, blue accent, [baza stylu]

**PL:** zmęczona 28-letnia ekspedientka, Brytyjka indyjskiego pochodzenia, ciemne włosy w niskim koku, fartuch piekarni na zwykłym swetrze, zmartwione, zmęczone oczy, w dwóch palcach trzyma wydrukowaną etykietę kanapki, za nią szklana witryna z zapakowanymi kanapkami.

---

## WYCIEK 🇵🇱 — `img/wyciek/`

Wspólne tło serii: biuro sieci szkół językowych z lat 70. — terminale z zielonym ekranem, szafy na taśmy, plakaty „Learn English!”, telefony z tarczą.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `zbigniew.png` | Zbigniew Pietras — prezes | `agresywny` | ceglasty |
| `grzegorz.png` | Grzegorz Ostrowski — administrator | `zgorzknialy` | morski |
| `monika.png` | Monika Bielecka — księgowa | `zmeczony` | musztardowy |
| `wojciech.png` | Wojciech Lis — zewnętrzny IOD | `czaruje` | niebieski |

### Zbigniew Pietras — prezes (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a 52-year-old company president, silver swept-back hair, wide lapels and a bold patterned tie, jaw clenched, pointing a finger at the viewer, desk with a leather chair and a phone off the hook, "Learn English!" poster behind him, brick red accent, [baza stylu]

**PL:** 52-letni prezes, siwe zaczesane do tyłu włosy, szerokie klapy marynarki i krzykliwy krawat, zaciśnięta szczęka, celuje palcem w rozmówcę, biurko ze skórzanym fotelem i zdjętą słuchawką, za nim plakat „Learn English!”.

### Grzegorz Ostrowski — administrator (zgorzkniały)
**EN:**
> 1970s Polish crime comic style portrait of a 38-year-old system administrator, long hair in a ponytail, thick-framed glasses, knitted vest over a checked shirt, leaning back with a sarcastic half-smile, holding a rejected budget memo stamped "ODRZUCONO", green-screen terminals and tape reels behind him, teal accent, [baza stylu]

**PL:** 38-letni administrator, długie włosy w kucyk, grube okulary, dziergany bezrękawnik na koszuli w kratę, odchylony na krześle z sarkastycznym półuśmiechem, trzyma notatkę budżetową z pieczątką „ODRZUCONO”, za nim terminale z zielonym ekranem i szpule taśm.

### Monika Bielecka — księgowa (zmęczona, obwinia się)
**EN:**
> 1970s Polish crime comic style portrait of a 44-year-old accountant, short practical haircut, blouse with a bow collar, eyes red from crying, hand pressed to her forehead, an envelope marked "PILNE — FAKTURA" open on the desk in front of her, adding machine and paper rolls, mustard yellow accent, [baza stylu]

**PL:** 44-letnia księgowa, krótka praktyczna fryzura, bluzka z kokardą pod szyją, zaczerwienione od płaczu oczy, dłoń przyciśnięta do czoła, przed nią na biurku otwarta koperta z napisem „PILNE — FAKTURA”, sumator i rolki papieru.

> Koperta zamiast maila to tłumaczenie phishingu na rekwizyt z epoki — czytelne w kadrze i spójne z resztą stylu.

### Wojciech Lis — zewnętrzny IOD (czaruje, formalista)
**EN:**
> 1970s Polish crime comic style portrait of a dapper 47-year-old data protection consultant, neatly trimmed beard, three-piece suit with a pocket square, smooth reassuring smile, holding a thick bound volume of regulations with many coloured bookmarks, wood-panelled office with law books behind him, blue accent, [baza stylu]

**PL:** elegancki 47-letni konsultant ds. ochrony danych, starannie przycięta broda, garnitur trzyczęściowy z poszetką, gładki, uspokajający uśmiech, trzyma grube oprawione wydanie przepisów z kolorowymi zakładkami, za nim gabinet z boazerią i półkami z kodeksami.

---

## Okładki spraw (opcjonalnie)

Gra ich teraz nie wyświetla. Są przydatne do kart spraw w przyszłości i do udostępniania w social media. Wzór jak okładka FENIKSA w `prompty-grafiki.md`.

| Plik | Prompt EN |
|---|---|
| `img/chlodnia/okladka.jpg` | 1970s Polish crime comic book cover, a dark catering kitchen at night, a single bulb over a huge aluminium pot, a thermometer and a crumpled temperature log on the steel counter, four shadowy figures in the doorway each looking away, bold hand-lettered title area at top reading "CHŁODNIA", flat retro palette, heavy ink shadows, halftone dots, faded offset print, vintage paper texture —ar 2:3 --style raw |
| `img/sezam/okladka.jpg` | 1970s Polish crime comic book cover, a bakery shop window at dawn in a rainy English street, a single sandwich with a printed label under a magnifying glass, sesame seeds scattered like evidence, four shadowy figures reflected in the glass, bold hand-lettered title area at top reading "SEZAM", flat retro palette, heavy ink shadows, halftone dots, faded offset print —ar 2:3 --style raw |
| `img/wyciek/okladka.jpg` | 1970s Polish crime comic book cover, a dim office at night, a green-screen terminal glowing, punched cards and index cards with names spilling out of an open filing cabinet onto the floor, an open envelope on the desk, four shadowy figures behind frosted glass, bold hand-lettered title area at top reading "WYCIEK", flat retro palette, heavy ink shadows, halftone dots, faded offset print —ar 2:3 --style raw |

Generatory często psują polskie litery w tytule („Ł”). Bezpieczniej wygenerować okładkę z pustym polem tytułu i dodać napis w edytorze.

---

## Scenariusze 02–06 (etap 2, opcjonalnie)

Postacie istniejących scenariuszy grają dziś z inicjałami. Poniżej krótkie prompty portretów; warianty emocji według tej samej metody co wyżej. Strategie zostaną przypisane przy dodawaniu metadanych YAML — do tego czasu generuj komplet pięciu emocji.

| Plik | Postać | Prompt EN (po `1970s Polish crime comic style portrait of …`, przed bazą stylu) |
|---|---|---|
| `img/nova/adam.png` | Adam Rylski — CEO, współzałożyciel | a charismatic 33-year-old startup founder, open-collar shirt and corduroy blazer, visionary gaze into the distance, gesturing mid-speech as if on stage, a slide projector beam behind him |
| `img/nova/pawel.png` | Paweł Zieliński — CTO | a cold precise 31-year-old engineer, turtleneck, thin wire glasses, arms folded, looking down his nose at the viewer, circuit boards and a terminal behind him |
| `img/nova/joanna.png` | Joanna Malec — partnerka funduszu VC | a guarded 45-year-old venture capital partner, sharp shoulder-padded suit, pen poised over a term sheet, lawyerly neutral expression, boardroom with a long table |
| `img/nova/karolina.png` | Karolina Nowak — Head of Sales | a tired but honest 29-year-old saleswoman, loosened scarf, coffee mug in both hands, frank direct gaze, empty open-plan office with packed boxes |
| `img/bilbord/magda.png` | Magda Sosnowska — Brand Manager | an energetic 36-year-old brand manager, sharp bob, pointing at a presentation chart with a pen, hunting-for-blame expression, slide projector screen behind |
| `img/bilbord/filip.png` | Filip Gajda — Account Manager | an agreeable 32-year-old account manager, wide tie, diplomatic open-palm gesture, polite evasive smile, agency office with mood boards |
| `img/bilbord/ola.png` | Ola Wierzbicka — Creative Director | a self-assured 38-year-old creative director, big round glasses, turtleneck, chin raised, slightly condescending look, a defaced billboard sketch pinned behind her |
| `img/blackout/krzysztof.png` | Krzysztof Bator — kierownik IT | a calm managerial 48-year-old IT head, neat side parting, tie clip, hands steepled, bland reassuring expression, flowchart of "processes" on the wall |
| `img/blackout/ania.png` | Ania Sroka — inżynierka SRE | a frustrated 30-year-old operations engineer, short spiky hair, headset around her neck, rapid-talker expression, wall of blinking server racks behind |
| `img/blackout/michal.png` | Michał Leszczyński — programista | a dejected 27-year-old programmer, hoodie, hunched shoulders, defensive wary eyes, printout of code with red corrections on his lap |
| `img/blackout/renata.png` | Renata Cichoń — dyrektorka e-commerce | a dynamic 42-year-old e-commerce director, power suit, holding a sales chart crashing downward, impatient results-driven expression, shop catalogue covers behind |
| `img/przejecie/robert.png` | Robert Maj — dyrektor integracji | a polished 46-year-old corporate integration director, perfect hair, presentation pointer in hand, upbeat corporate smile, slide titled "JOURNEY" behind |
| `img/przejecie/szymon.png` | Szymon Brzozowski — founder na earn-oucie | a jovial 44-year-old founder, open shirt with a gold chain, theatrical wounded expression, framed photo of his old team on the wall |
| `img/przejecie/ewa.png` | Ewa Lange — HR Business Partner | a cautious procedural 41-year-old HR partner, buttoned-up blouse, reading from a typed procedure sheet, controlled neutral face, filing cabinets behind |
| `img/przejecie/natalia.png` | Natalia Wrona — była lead inżynierka | a sharp-tongued 34-year-old former lead engineer, leather jacket, cigarette in hand, sardonic grin, café table with a newspaper |
| `img/konsorcjum/artur.png` | Artur Sikora — PM Sigmexu | a routine polite 50-year-old project manager, grey suit, tapping a thick stack of meeting minutes, practiced smile, archive shelves of binders |
| `img/konsorcjum/daniel.png` | Daniel Krupa — dyrektor IT szpitali | an officious 55-year-old hospital IT director, official badge on lapel, hand on a book of statutes, formally impeccable stern look, hospital corridor behind |
| `img/konsorcjum/marta.png` | Marta Zawisza — była PM Sigmexu | a calmly bitter 39-year-old former project manager, simple dark sweater, hands folded, measured steady gaze, rain on a window behind her |
| `img/konsorcjum/iga.png` | Iga Halicka — radczyni prawna | a surgically precise 43-year-old in-house lawyer, sleek chignon, reading glasses, pen tapping a signed contract clause, legal library |
| `img/konsorcjum/beniamin.png` | Beniamin Orski — audytor bezpieczeństwa | an impassive 40-year-old security auditor, plain grey suit, expressionless face, holding a sealed red audit report, server room door with a padlock |

## Podsumowanie ilościowe

| Pakiet | Portrety | Emocje wymagane | Emocje pełne | Okładki |
|---|---|---|---|---|
| CHŁODNIA | 4 | 13 | 20 | 1 |
| SEZAM | 4 | 14 | 20 | 1 |
| WYCIEK | 4 | 14 | 20 | 1 |
| Scenariusze 02–06 (etap 2) | 19 | wg strategii | 95 | 5 (wg wzoru) |

Kolejność pracy: portrety trzech nowych spraw → emocje wymagane → okładki → etap 2.
