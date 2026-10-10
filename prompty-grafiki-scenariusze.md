# Grafiki do scenariuszy branżowych — lista plików i prompty

Uzupełnienie [`prompty-grafiki.md`](prompty-grafiki.md): ten sam styl (polski komiks kryminalny lat 70.), te same uwagi techniczne per generator i ta sama zasada praw autorskich. Tu są postacie spraw branżowych (CHŁODNIA, SEZAM, WYCIEK, ROZSYŁKA, LISTERIA, KUPON, REGAŁ, RUSZTOWANIE, BLOKADA), opcjonalne grafiki dla scenariuszy 02–06 i okładki spraw.

Gra działa bez żadnego z tych plików: brak portretu = inicjały na kolorze, brak wariantu emocji = dymek bez obrazka. Można więc dokładać grafiki stopniowo.

## Konwencja plików

| Co | Ścieżka | Format |
|---|---|---|
| Portret (wariant neutralny) | `img/<id>/<slug>.png` | 1:1, generuj 1024×1024, zapisz 384×384 |
| Wariant emocji | `img/<id>/emocje/<slug>-<emocja>.jpg` | 1:1, zapisz 768×768 |
| Okładka sprawy | `img/<id>/okladka.jpg` | 2:3 |

`<id>` i `<slug>` to małe litery bez polskich znaków: `CHLODNIA` → `chlodnia`, `Grażyna` → `grazyna`. Emocje: `radosc`, `zlosc`, `zaskoczenie`, `smutek`, `rezygnacja`.

FENIKS zostaje w dotychczasowych ścieżkach (`img/marek.png`, `img/emocje/marek-zlosc.jpg` itd.).

## Import do gry

Nie musisz nazywać plików dokładnie według tabeli. Wrzuć wszystko do jednego katalogu (podkatalogi wolno) i uruchom:

```
npm run grafiki -- ~/Pobrane/grafiki
npm run grafiki -- --stan        # co jeszcze brakuje
```

Nazwa pliku musi zawierać sprawę i imię, a dla wariantu — emocję (po polsku lub po angielsku: `anger`, `surprised`, `sad`, `happy`, `resigned`). Bez emocji = portret; słowo `okladka`/`cover` = okładka. Przykłady: `CHŁODNIA - Ryszard.png`, `chlodnia_ryszard_złość.png`, `sezam/grazyna-surprised.jpg`, `wyciek okladka.webp`. Skrypt przycina do środka, skaluje (portret 384², emocja 768², okładka 682×1024) i zapisuje pod ścieżką, której szuka gra. Nazw niejednoznacznych nie zgaduje — wypisuje je z powodem.

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

## ROZSYŁKA 🇬🇧 — `img/rozsylka/`

Wspólne tło serii: biuro firmy logistycznej w Leeds w stylu lat 70. — segregatory, dalekopis, mapa tras ciężarówek na ścianie, mokre okno z widokiem na plac manewrowy.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `weronika.png` | Weronika Sadowska — specjalistka ds. kadr | `zmeczony` | morski |
| `nigel.png` | Nigel Ashworth — dyrektor operacyjny | `czaruje` | musztardowy |
| `edyta.png` | Edyta Kamińska — administratorka IT, opiekunka ochrony danych | `unika` | niebieski |

### Weronika Sadowska — kadry (zmęczona, obwinia się)
**EN:**
> 1970s Polish crime comic style portrait of a worn-out 34-year-old HR clerk, hair coming loose from a clip, cardigan over a blouse, red-rimmed guilty eyes, one hand pressed to her forehead, an open personnel file and a desk phone off the hook in front of her, office with filing cabinets and rain on the window behind, teal accent, [baza stylu]

**PL:** wyczerpana 34-letnia kadrowa, włosy wysuwające się ze spinki, kardigan na bluzce, zaczerwienione oczy pełne poczucia winy, dłoń przyciśnięta do czoła, przed nią otwarta teczka osobowa i zdjęta słuchawka, za nią szafy na akta i deszcz na szybie.

### Nigel Ashworth — dyrektor operacyjny (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a smooth 52-year-old English operations director, silver swept-back hair, three-piece suit with a loosened tie, disarming confident grin, holding a mug of tea and gesturing reassuringly with the other hand, a large wall map of lorry routes across northern England behind him, mustard yellow accent, [baza stylu]

**PL:** gładki 52-letni angielski dyrektor operacyjny, siwe zaczesane do tyłu włosy, garnitur z kamizelką i poluzowany krawat, rozbrajający pewny siebie uśmiech, w jednej ręce kubek herbaty, drugą uspokajająco gestykuluje, za nim mapa tras ciężarówek po północnej Anglii.

### Edyta Kamińska — IT i ochrona danych (unika)
**EN:**
> 1970s Polish crime comic style portrait of a reserved 41-year-old IT administrator, short practical haircut, oversized glasses, polo-neck sweater, eyes fixed on a typed memo she holds up like a shield, a tangle of cables and a green-screen terminal behind her, blue accent, [baza stylu]

**PL:** powściągliwa 41-letnia administratorka IT, krótka praktyczna fryzura, duże okulary, golf, wzrok wbity w maszynopis notatki trzymany przed sobą jak tarcza, za nią plątanina kabli i terminal z zielonym ekranem.

---

## LISTERIA 🇵🇱 — `img/listeria/`

Wspólne tło serii: zakład wędliniarski z lat 70. — białe kafle, nierdzewne przenośniki, wędzarnie, kratki odpływowe w posadzce, ostre światło jarzeniówek i para.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `bogdan.png` | Bogdan Wilczek — prezes, współwłaściciel | `agresywny` | ceglasty |
| `teresa.png` | Teresa Zawada — kierowniczka jakości (HACCP) | `czaruje` | niebieski |
| `oskar.png` | Oskar Lipiński — kierownik produkcji | `unika` | musztardowy |
| `lucyna.png` | Lucyna Grabarczyk — brygadzistka ekipy mycia | `zmeczony` | morski |

### Bogdan Wilczek — prezes (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a burly 60-year-old meat plant owner, grey crew cut, heavy jowls, sheepskin-collared jacket over a white coat, jabbing a finger at the viewer, furious red face, a ledger and a ring of salami sausages on the desk, smokehouse doors behind him, brick red accent, [baza stylu]

**PL:** postawny 60-letni właściciel zakładu mięsnego, siwy jeżyk, ciężkie policzki, kurtka z kożuszkiem narzucona na biały fartuch, wymierza palec w widza, czerwona ze złości twarz, na biurku księga i wianek kiełbasy, za nim drzwi wędzarni.

### Teresa Zawada — jakość (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a poised 46-year-old quality manager, white lab coat over a silk blouse, neat permed hair, reassuring polished smile, holding up a lab report with a big green tick, a wall chart with neat columns of zeros behind her, blue accent, [baza stylu]

**PL:** opanowana 46-letnia kierowniczka jakości, biały fartuch laboratoryjny na jedwabnej bluzce, starannie ułożona trwała, uspokajający wyćwiczony uśmiech, unosi raport z laboratorium z wielkim zielonym „ptaszkiem”, za nią tablica z równymi kolumnami zer.

### Oskar Lipiński — kierownik produkcji (unika)
**EN:**
> 1970s Polish crime comic style portrait of a nervous 38-year-old production manager, white hairnet and coat, thin moustache, eyes darting sideways, hands hidden behind his back, a stainless conveyor with a crude riveted metal patch and smeared silicone behind him, mustard yellow accent, [baza stylu]

**PL:** nerwowy 38-letni kierownik produkcji, biała siatka na włosach i fartuch, cienki wąsik, wzrok uciekający w bok, ręce schowane za plecami, za nim nierdzewny przenośnik z prowizoryczną blachą na nitach i rozmazanym silikonem.

### Lucyna Grabarczyk — brygadzistka mycia (zmęczona)
**EN:**
> 1970s Polish crime comic style portrait of an exhausted 52-year-old cleaning crew forewoman on a night shift, rubber apron and long gloves, kerchief over her hair, drooping tired eyes, leaning on a pressure washer lance, wet tiled floor with a floor drain and steam behind her, teal accent, [baza stylu]

**PL:** wyczerpana 52-letnia brygadzistka nocnej ekipy mycia, gumowy fartuch i długie rękawice, chustka na włosach, opadające zmęczone powieki, opiera się o lancę myjki ciśnieniowej, za nią mokre kafle z kratką odpływową i para.

---

## KUPON 🇵🇱 — `img/kupon/`

Wspólne tło serii: pizzeria i biuro software house'u w stylu lat 70. — piec opalany drewnem, łopaty do pizzy, karty stałego klienta z pieczątkami, terminal i wydruki z drukarki igłowej.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `leszek.png` | Leszek Bartnik — prezes sieci pizzerii | `czaruje` | musztardowy |
| `sylwia.png` | Sylwia Olech — kierowniczka marketingu i aplikacji | `unika` | niebieski |
| `hubert.png` | Hubert Ziętara — szef techniczny software house'u | `agresywny` | ceglasty |
| `celina.png` | Celina Wawrzyniak — kierowniczka ds. jakości i bezpieczeństwa żywności | `zmeczony` | morski |

### Leszek Bartnik — prezes sieci (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a jovial 49-year-old pizzeria chain owner, open-collar patterned shirt, gold watch, broad salesman's smile, holding a fanned stack of loyalty stamp cards like a winning poker hand, a wood-fired pizza oven and wooden peels behind him, mustard yellow accent, [baza stylu]

**PL:** jowialny 49-letni właściciel sieci pizzerii, rozpięta wzorzysta koszula, złoty zegarek, szeroki uśmiech sprzedawcy, trzyma wachlarz kart stałego klienta z pieczątkami jak wygrywające karty w pokerze, za nim piec opalany drewnem i drewniane łopaty.

### Sylwia Olech — marketing (unika)
**EN:**
> 1970s Polish crime comic style portrait of a stylish 32-year-old marketing manager, big hoop earrings, patterned scarf, looking away over her shoulder, clutching a campaign poster rolled into a tube, a corkboard with leaflets reading "PIZZA BEZ GLUTENU" behind her, blue accent, [baza stylu]

**PL:** stylowa 32-letnia kierowniczka marketingu, duże koła w uszach, wzorzysta apaszka, patrzy w bok przez ramię, ściska zrolowany plakat kampanii, za nią tablica korkowa z ulotkami „PIZZA BEZ GLUTENU”.

### Hubert Ziętara — software house (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a combative 37-year-old tech company co-founder, sideburns, leather jacket over a turtleneck, scowling, slamming a thick printed contract onto the desk, a mainframe terminal and stacks of continuous-feed printouts behind him, brick red accent, [baza stylu]

**PL:** zadziorny 37-letni współzałożyciel firmy informatycznej, bokobrody, skórzana kurtka na golfie, zmarszczone brwi, z hukiem rzuca na biurko grubą wydrukowaną umowę, za nim terminal i stosy wydruków z papieru składanki.

### Celina Wawrzyniak — jakość i bezpieczeństwo żywności (zmęczona)
**EN:**
> 1970s Polish crime comic style portrait of a weary 44-year-old food safety manager, white coat and hairnet, reading glasses pushed up on her head, tired resigned eyes, holding an allergen chart with crossed-out rows, a pizzeria prep kitchen with ingredient tubs behind her, teal accent, [baza stylu]

**PL:** znużona 44-letnia kierowniczka ds. bezpieczeństwa żywności, biały fartuch i czepek, okulary do czytania podsunięte na głowę, zmęczony zrezygnowany wzrok, trzyma tabelę alergenów z przekreślonymi wierszami, za nią kuchnia pizzerii z pojemnikami składników.

---

## REGAŁ 🇵🇱 — `img/regal/`

Wspólne tło serii: hala magazynu wysokiego składowania w stylu lat 70. — rzędy pomarańczowo-niebieskich regałów, palety, wózki widłowe, żółte pasy na posadzce, sodowe lampy pod dachem.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `rafal.png` | Rafał Wierzbicki — dyrektor centrum dystrybucyjnego | `czaruje` | musztardowy |
| `zofia.png` | Zofia Krawiec — specjalistka ds. BHP | `zmeczony` | morski |
| `jacek.png` | Jacek Doliński — kierownik zmiany | `agresywny` | ceglasty |
| `patryk.png` | Patryk Sowa — operator wózka wysokiego składowania | `zgorzknialy` | niebieski |

### Rafał Wierzbicki — dyrektor centrum (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a slick 45-year-old warehouse director, tailored suit with a hi-vis vest worn open over it like a fashion accessory, confident salesman's smile, holding up a bar chart of rising productivity, towering pallet racks behind him, mustard yellow accent, [baza stylu]

**PL:** gładki 45-letni dyrektor magazynu, dopasowany garnitur z kamizelką odblaskową narzuconą jak dodatek, pewny siebie uśmiech sprzedawcy, unosi wykres słupkowy rosnącej wydajności, za nim wysokie regały paletowe.

### Zofia Krawiec — BHP (zmęczona)
**EN:**
> 1970s Polish crime comic style portrait of a weary 50-year-old safety officer, grey bun, reading glasses on a chain, hi-vis vest over a cardigan, holding a thick stack of risk assessment binders against her chest, tired guilty eyes, a small cluttered office with a window onto the warehouse floor behind her, teal accent, [baza stylu]

**PL:** znużona 50-letnia specjalistka BHP, siwy kok, okulary na łańcuszku, kamizelka odblaskowa na swetrze, przyciska do piersi stos segregatorów z oceną ryzyka, zmęczone oczy z poczuciem winy, za nią ciasne biuro z oknem na halę.

### Jacek Doliński — kierownik zmiany (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a hard-driving 39-year-old shift manager, shaved head, hi-vis vest, walkie-talkie in a clenched fist, leaning forward aggressively, barking expression, a big wall clock and a productivity ranking board with names behind him, brick red accent, [baza stylu]

**PL:** twardy 39-letni kierownik zmiany, ogolona głowa, kamizelka odblaskowa, krótkofalówka w zaciśniętej pięści, agresywnie pochylony do przodu, wykrzykujący wyraz twarzy, za nim duży zegar ścienny i tablica rankingu wydajności z nazwiskami.

### Patryk Sowa — operator wózka (zgorzkniały)
**EN:**
> 1970s Polish crime comic style portrait of a sullen 26-year-old forklift operator, buzz cut, work jacket with company patch, sitting in the cab of a tall reach truck, arms folded over the steering wheel, bitter sarcastic half-smile, dented rack upright with warning tape in the background, blue accent, [baza stylu]

**PL:** ponury 26-letni operator wózka, krótko ostrzyżony, kurtka robocza z naszywką firmy, siedzi w kabinie wysokiego wózka, ręce skrzyżowane na kierownicy, gorzki sarkastyczny półuśmiech, w tle wgnieciony słup regału oklejony taśmą ostrzegawczą.

---

## RUSZTOWANIE 🇬🇧 — `img/rusztowanie/`

Wspólne tło serii: budowa bloku mieszkalnego w deszczowym Manchesterze lat 70. — rusztowania z rur i desek, siatki, ceglane mury, kontener biura budowy, szare niebo.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `craig.png` | Craig Bramhall — kierownik budowy (generalny wykonawca) | `agresywny` | ceglasty |
| `linda.png` | Linda Hargreaves — koordynatorka BHP (H&S advisor) | `unika` | niebieski |
| `konrad.png` | Konrad Zawilski — właściciel firmy murarskiej (podwykonawca) | `czaruje` | musztardowy |
| `gustaw.png` | Gustaw Pietrzak — brygadzista murarzy | `zmeczony` | morski |

### Craig Bramhall — kierownik budowy (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a red-faced 48-year-old English site manager, white hard hat pushed back, hi-vis jacket over a shirt and tie, jabbing a rolled-up programme chart toward the viewer, furious glare, site cabin with a wall planner full of red deadlines behind him, brick red accent, [baza stylu]

**PL:** czerwony na twarzy 48-letni angielski kierownik budowy, biały kask zsunięty do tyłu, kurtka odblaskowa na koszuli z krawatem, wymachuje zrolowanym harmonogramem w stronę widza, wściekłe spojrzenie, za nim kontener biura z planerem pełnym czerwonych terminów.

### Linda Hargreaves — koordynatorka BHP (unika)
**EN:**
> 1970s Polish crime comic style portrait of a cautious 36-year-old English health and safety advisor, neat ponytail under a white hard hat, hi-vis vest, clipboard with an inspection register held close, eyes avoiding the viewer, scaffolding wrapped in netting behind her, blue accent, [baza stylu]

**PL:** ostrożna 36-letnia angielska koordynatorka BHP, schludny kucyk pod białym kaskiem, kamizelka odblaskowa, przyciska podkładkę z rejestrem inspekcji, wzrok unikający widza, za nią rusztowanie owinięte siatką.

### Konrad Zawilski — podwykonawca (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a charming 52-year-old Polish building contractor in England, tweed flat cap, quilted gilet over a checked shirt, gold signet ring, warm persuasive smile, offering a handshake, a van with his company name painted on the side behind him, mustard yellow accent, [baza stylu]

**PL:** czarujący 52-letni polski przedsiębiorca budowlany w Anglii, tweedowy kaszkiet, pikowana kamizelka na koszuli w kratę, złoty sygnet, ciepły przekonujący uśmiech, wyciąga rękę do uścisku, za nim furgonetka z namalowaną nazwą firmy.

### Gustaw Pietrzak — brygadzista (zmęczony)
**EN:**
> 1970s Polish crime comic style portrait of an exhausted 57-year-old bricklayer foreman, weathered face, grey stubble, dusty hard hat in his hands, brick-dust on his work jacket, hollow tired eyes, sitting on a stack of bricks at the foot of a scaffold in the rain, teal accent, [baza stylu]

**PL:** wyczerpany 57-letni brygadzista murarzy, ogorzała twarz, siwy zarost, zakurzony kask w dłoniach, ceglany pył na kurtce roboczej, puste zmęczone oczy, siedzi na stosie cegieł u stóp rusztowania w deszczu.

---

## BLOKADA 🇵🇱 — `img/blokada/`

Wspólne tło serii: tłocznia z lat 70. — rzędy pras hydraulicznych, szafy sterownicze z otwartymi drzwiami, tablice z przyciskami, kraty, żółto-czarne pasy ostrzegawcze, kłódki.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `wieslaw.png` | Wiesław Kordecki — dyrektor zakładu | `agresywny` | ceglasty |
| `ilona.png` | Ilona Sadurska — starsza specjalistka ds. BHP | `czaruje` | niebieski |
| `bartosz.png` | Bartosz Mielczarek — kierownik utrzymania ruchu | `unika` | musztardowy |
| `damian.png` | Damian Sowiński — brygadzista, operator pras (noc) | `zmeczony` | morski |
| `urszula.png` | Urszula Węgrzyn — współwłaścicielka firmy serwisowej | `zgorzknialy` | fioletowy |

### Wiesław Kordecki — dyrektor zakładu (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a domineering 58-year-old factory director, heavy-rimmed glasses, grey suit, slamming a palm on a desk covered with production reports, furious red face, a window overlooking a row of hydraulic presses behind him, brick red accent, [baza stylu]

**PL:** apodyktyczny 58-letni dyrektor fabryki, okulary w grubych oprawkach, szary garnitur, uderza dłonią w biurko zasłane raportami produkcji, czerwona ze złości twarz, za nim okno z widokiem na rząd pras hydraulicznych.

### Ilona Sadurska — BHP (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of an elegant 44-year-old senior safety specialist, styled auburn hair, white helmet tucked under her arm, silk scarf, polished reassuring smile, presenting a laminated LOTO procedure poster like a certificate, an audit trophy on a shelf behind her, blue accent, [baza stylu]

**PL:** elegancka 44-letnia starsza specjalistka BHP, ułożone rude włosy, biały kask pod pachą, jedwabna apaszka, wyćwiczony uspokajający uśmiech, prezentuje zalaminowany plakat procedury LOTO jak dyplom, za nią na półce trofeum z audytu.

### Bartosz Mielczarek — utrzymanie ruchu (unika)
**EN:**
> 1970s Polish crime comic style portrait of an evasive 41-year-old maintenance manager, overalls with many pens in the chest pocket, ring of keys on his belt, looking down at a work order slip, avoiding eye contact, an open electrical control cabinet with tangled wires behind him, mustard yellow accent, [baza stylu]

**PL:** wymijający 41-letni kierownik utrzymania ruchu, kombinezon z wieloma długopisami w kieszonce, pęk kluczy przy pasku, wpatrzony w kartkę zlecenia, unika kontaktu wzrokowego, za nim otwarta szafa sterownicza z plątaniną przewodów.

### Damian Sowiński — brygadzista nocnej zmiany (zmęczony)
**EN:**
> 1970s Polish crime comic style portrait of a haggard 35-year-old night-shift press foreman, ear defenders around his neck, oil-stained work gloves, a single padlock key on a string in his hand, red-rimmed sleepless eyes, dim factory hall with a glowing press control panel behind him, teal accent, [baza stylu]

**PL:** wymizerowany 35-letni brygadzista nocnej zmiany, nauszniki na szyi, poplamione olejem rękawice, w dłoni pojedynczy klucz do kłódki na sznurku, zaczerwienione niewyspane oczy, za nim półmrok hali i podświetlony pulpit prasy.

### Urszula Węgrzyn — firma serwisowa (zgorzkniała)
**EN:**
> 1970s Polish crime comic style portrait of a sharp 53-year-old co-owner of a small hydraulic service firm, cropped grey hair, work fleece with a company logo, arms crossed, bitter knowing smirk, a toolbox and a pinned photo of her injured technician on a corkboard behind her, purple accent, [baza stylu]

**PL:** cięta 53-letnia współwłaścicielka małej firmy serwisu hydrauliki, krótkie siwe włosy, polar roboczy z logo firmy, skrzyżowane ręce, gorzki porozumiewawczy uśmieszek, za nią skrzynka narzędziowa i przypięte do tablicy zdjęcie rannego technika.

---

## MENU 🇬🇧 — `img/menu/`

Wspólne tło serii: angielskie bistro z brunchem w stylu lat 70. — drewniane stoliki z kodami QR na tabliczkach, tablica z menu kredą, ekspres do kawy, gwarna sala w sobotni poranek, deszcz na witrynie.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `hanna.png` | Hanna Wilczyńska — kierowniczka zakupów i operacji sieci | `czaruje` | musztardowy |
| `seweryn.png` | Seweryn Kołodziej — kierownik bistro przy Market Street | `zgorzknialy` | fioletowy |
| `ethan.png` | Ethan Briggs — kelner, obsługa sali | `agresywny` | ceglasty |

### Hanna Wilczyńska — kierowniczka zakupów i operacji (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a warm 46-year-old Polish operations manager of a bistro chain in England, polished bob haircut, tailored blazer with a small brooch, radiant welcoming smile, holding a tablet that shows a glossy allergen filter screen, a stack of supplier price lists on the table beside her, mustard yellow accent, [baza stylu]

**PL:** ciepła 46-letnia polska kierowniczka operacji sieci bistro w Anglii, wypielęgnowany bob, dopasowana marynarka z drobną broszką, promienny gościnny uśmiech, trzyma tablet z błyszczącym ekranem filtra alergenów, obok na stole stos cenników dostawców.

### Seweryn Kołodziej — kierownik bistro (zgorzkniały)
**EN:**
> 1970s Polish crime comic style portrait of a bitter 43-year-old Polish bistro manager, stained apron over a rolled-sleeve shirt, tea towel on his shoulder, arms crossed, sardonic crooked smirk, a bucket of green sauce and a battered ring binder on the pass behind him, purple accent, [baza stylu]

**PL:** zgorzkniały 43-letni polski kierownik bistro, poplamiony fartuch na koszuli z podwiniętymi rękawami, ścierka na ramieniu, skrzyżowane ręce, ironiczny krzywy uśmieszek, za nim na podajniku wiaderko z zieloną pastą i sfatygowany segregator.

### Ethan Briggs — kelner (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a defensive 19-year-old English waiter, floppy fringe, black waistcoat and white shirt, a plate in one hand and the other jabbing a finger at the viewer, loud indignant expression, crowded brunch tables with a queue by the door behind him, brick red accent, [baza stylu]

**PL:** zadziorny 19-letni angielski kelner, opadająca grzywka, czarna kamizelka i biała koszula, w jednej ręce talerz, drugą wskazuje oskarżycielsko na widza, głośny oburzony wyraz twarzy, za nim zatłoczone stoliki brunchu i kolejka przy drzwiach.

---

## WRZĄTEK 🇵🇱 — `img/wrzatek/`

Wspólne tło serii: stołówka zakładowa fabryki okuć w stylu lat 70. — duży kocioł warzelny z parą, aluminiowe garnki, kafelkowe ściany, okienko wydawcze, kolejka robotników w roboczych kombinezonach.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `bozena.png` | Bożena Chmielarz — kierowniczka kuchni stołówki zakładowej | `zmeczony` | morski |
| `kazimierz.png` | Kazimierz Gołąbek — kierownik działu administracyjno-gospodarczego | `agresywny` | ceglasty |
| `paulina.png` | Paulina Lisowska — specjalistka ds. BHP | `unika` | niebieski |

### Bożena Chmielarz — kierowniczka kuchni (zmęczona)
**EN:**
> 1970s Polish crime comic style portrait of an exhausted 52-year-old canteen kitchen manager, white cook's coat and headscarf, flushed face, strands of grey hair stuck to her forehead, a stained cloth in her hand and a worn notebook tucked under her arm, tired apologetic eyes, a steaming kettle and a row of pots behind her, teal accent, [baza stylu]

**PL:** wyczerpana 52-letnia kierowniczka kuchni stołówki, biała bluza kucharska i chustka na głowie, zaczerwieniona twarz, kosmyki siwych włosów przyklejone do czoła, w dłoni poplamiona ścierka, pod pachą sfatygowany zeszyt, zmęczone przepraszające oczy, za nią parujący kocioł i rząd garnków.

### Kazimierz Gołąbek — kierownik administracyjno-gospodarczy (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of a bullying 55-year-old administrative manager, stocky, brown suit with a loosened tie, pointing a thick finger at the viewer, shouting expression, an abacus and a pile of invoices on his desk, a window onto the canteen behind him, brick red accent, [baza stylu]

**PL:** zastraszający 55-letni kierownik administracyjno-gospodarczy, krępy, brązowy garnitur z poluzowanym krawatem, grubym palcem wskazuje widza, krzyczący wyraz twarzy, na biurku liczydło i sterta faktur, za nim okno z widokiem na stołówkę.

### Paulina Lisowska — specjalistka ds. BHP (unika)
**EN:**
> 1970s Polish crime comic style portrait of a reserved 38-year-old safety specialist, neat dark bob, white hard hat and a cardigan, hugging a folder of stamped documents to her chest, polite stiff smile with eyes turned aside, a framed occupational risk chart and a first-aid cabinet on the wall behind her, blue accent, [baza stylu]

**PL:** powściągliwa 38-letnia specjalistka BHP, schludny ciemny bob, biały kask i sweter, przyciska do piersi teczkę z opieczętowanymi dokumentami, uprzejmy sztywny uśmiech i wzrok odwrócony w bok, za nią oprawiona tabela ryzyka zawodowego i apteczka na ścianie.

---

## CHMURA 🇵🇱 — `img/chmura/`

Wspólne tło serii: biuro startupu SaaS we Wrocławiu w stylu lat 70. — open space z dużymi monitorami, szafy serwerowe za szybą, tablica z wykresami sprzedaży, kubki po kawie, ciężkie jesienne niebo za oknem.

| Plik | Postać | Strategia | Akcent |
|---|---|---|---|
| `maciej.png` | Maciej Lorenc — prezes zarządu i współzałożyciel Naborix | `czaruje` | musztardowy |
| `tymon.png` | Tymon Kwiatek — dyrektor techniczny (CTO) | `agresywny` | ceglasty |
| `zuzanna.png` | Zuzanna Rydel — inspektorka ochrony danych i specjalistka ds. umów | `zgorzknialy` | fioletowy |
| `lucja.png` | Łucja Brandys — kierowniczka produktu „Dopasowanie AI" | `unika` | niebieski |
| `igor.png` | Igor Sawko — inżynier DevOps | `zmeczony` | morski |

### Maciej Lorenc — prezes zarządu (czaruje)
**EN:**
> 1970s Polish crime comic style portrait of a charismatic 42-year-old startup CEO, slim-cut suit without a tie, open collar, expansive reassuring smile, one hand spread in a welcoming gesture, a glossy pitch-deck slide with "trust" and rising arrows on a screen behind him, mustard yellow accent, [baza stylu]

**PL:** charyzmatyczny 42-letni prezes startupu, dopasowany garnitur bez krawata, rozpięty kołnierzyk, szeroki uspokajający uśmiech, jedna dłoń otwarta w geście powitania, za nim na ekranie błyszczący slajd prezentacji ze słowem „zaufanie" i strzałkami w górę.

### Tymon Kwiatek — dyrektor techniczny (agresywny)
**EN:**
> 1970s Polish crime comic style portrait of an arrogant 40-year-old chief technology officer, black hoodie under a blazer, beard stubble, leaning in with a condescending glare, a mug in one fist, a whiteboard scrawled with a cloud architecture diagram and cables behind him, brick red accent, [baza stylu]

**PL:** arogancki 40-letni dyrektor techniczny, czarna bluza pod marynarką, zarost, pochylony do przodu z protekcjonalnym spojrzeniem, w pięści kubek, za nim tablica zapisana schematem architektury chmury i splątane kable.

### Zuzanna Rydel — inspektorka ochrony danych (zgorzkniała)
**EN:**
> 1970s Polish crime comic style portrait of a sardonic 37-year-old data protection officer, sensible cardigan, glasses pushed up into short dark hair, arms folded over a thick folder of dated memos with colourful tabs, bitter dry smile, a cramped desk tucked next to the sales department behind her, purple accent, [baza stylu]

**PL:** sarkastyczna 37-letnia inspektorka ochrony danych, praktyczny sweter, okulary wsunięte w krótkie ciemne włosy, ręce założone na grubej teczce z datowanymi notatkami i kolorowymi zakładkami, gorzki ironiczny uśmiech, za nią ciasne biurko wciśnięte obok działu sprzedaży.

### Łucja Brandys — kierowniczka produktu (unika)
**EN:**
> 1970s Polish crime comic style portrait of a smooth, evasive 33-year-old product manager, sleek ponytail, smart blouse with a lanyard badge, a laptop held like a shield against her chest, polite practised smile while her eyes dart aside, sticky notes and a colourful roadmap board behind her, blue accent, [baza stylu]

**PL:** gładka, wymijająca 33-letnia kierowniczka produktu, gładki kucyk, elegancka bluzka z identyfikatorem na smyczy, laptop przyciśnięty do piersi jak tarcza, uprzejmy wyćwiczony uśmiech i uciekający w bok wzrok, za nią karteczki samoprzylepne i kolorowa tablica planu rozwoju produktu.

### Igor Sawko — inżynier DevOps (zmęczony)
**EN:**
> 1970s Polish crime comic style portrait of an exhausted 29-year-old DevOps engineer, rumpled t-shirt under an open flannel shirt, dark circles under bloodshot eyes, unkempt hair, headphones around his neck, hands wrapped around a cold coffee, several monitors of scrolling logs glowing behind him in a dim server corner, teal accent, [baza stylu]

**PL:** wyczerpany 29-letni inżynier DevOps, pognieciona koszulka pod rozpiętą flanelową koszulą, sine cienie pod przekrwionymi oczami, rozczochrane włosy, słuchawki na szyi, dłonie owinięte wokół zimnej kawy, za nim w półmroku kilka monitorów z przewijającymi się logami.

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
| ROZSYŁKA | 3 | 10 | 15 | 1 |
| LISTERIA | 4 | 13 | 20 | 1 |
| KUPON | 4 | 13 | 20 | 1 |
| REGAŁ | 4 | 14 | 20 | 1 |
| RUSZTOWANIE | 4 | 13 | 20 | 1 |
| BLOKADA | 5 | 17 | 25 | 1 |
| MENU | 3 | 10 | 15 | 1 |
| WRZĄTEK | 3 | 10 | 15 | 1 |
| CHMURA | 5 | 17 | 25 | 1 |
| Scenariusze 02–06 (etap 2) | 19 | wg strategii | 95 | 5 (wg wzoru) |

Kolejność pracy: portrety spraw branżowych → emocje wymagane → okładki → etap 2.
