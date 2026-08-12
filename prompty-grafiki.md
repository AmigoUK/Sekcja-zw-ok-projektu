# Prompty grafik postaci — styl: polski komiks kryminalny lat 70.

Estetyka inspirowana polskimi komiksami milicyjnymi z lat 70. (klimat serii w rodzaju „Kapitana Żbika"): płaskie kolory z ograniczonej palety, gruby czarny kontur tuszem, raster offsetowy (kropki halftone), lekko wyblakły papier, dramatyczne kadrowanie i cienie jak w kryminale. Poniżej gotowe prompty dla generatorów obrazu (Midjourney, DALL-E, Stable Diffusion/Flux) — po angielsku (działają najlepiej) + wersje polskie.

## Specyfikacja plików dla gry

Aplikacja automatycznie podmienia inicjały na portrety, jeśli obok `sekcja-zwlok.html` istnieje katalog `img/` z plikami:

| Plik | Postać | Format |
|------|--------|--------|
| `img/marek.png` | Marek Zawada — Project Manager | kwadrat 1:1, min. 256×256, portret (head & shoulders) |
| `img/beata.png` | Beata Krajewska — Account Manager | jw. |
| `img/tomek.png` | Tomek Wilk — Tech Lead | jw. |
| `img/iwona.png` | Iwona Stachura — PM klienta | jw. |

Wskazówka: generuj w 1024×1024, potem przytnij twarz do kadru. Zadbaj o spójność: ta sama paleta i ten sam prompt bazowy dla całej czwórki (zmienia się tylko opis osoby).

### Warianty mimiki

Komplet w `img/emocje/` trzyma konwencję `<postać>-<emocja>.jpg` (768×768), gdzie emocja to jedna z: `radosc`, `zlosc`, `zaskoczenie`, `smutek`, `rezygnacja`. Wariant neutralny nie jest duplikowany — to portret główny z tabeli wyżej. Generując nowe warianty, dokładaj do promptu bazowego wyłącznie opis wyrazu twarzy i zostaw resztę kadru (tabliczka z nazwiskiem, tło, rekwizyt) bez zmian, żeby zestaw dał się podmieniać w locie.

## Prompt bazowy stylu (doklejany do każdego portretu)

**EN (baza):**
> portrait, 1970s Polish crime comic book style, militia detective comics aesthetic, bold black ink outlines, flat limited color palette (mustard yellow, brick red, teal, cream paper), visible halftone dots, slightly faded offset print, dramatic noir side lighting, vintage 1970s office background, retro comic panel, head and shoulders composition —no photorealism, no 3d render, no manga

**PL (dla modeli rozumiejących polski):**
> portret w stylu polskiego komiksu kryminalnego z lat 70., gruba czarna kreska tuszem, płaskie kolory z ograniczonej palety (musztardowy, ceglasty, morski, kremowy papier), widoczny raster drukarski, lekko wyblakły druk offsetowy, dramatyczne boczne światło jak w kryminale, tło: biuro z lat 70., kadr: głowa i ramiona

## Portrety postaci (FENIKS)

### 1. Marek Zawada — Project Manager (unika odpowiedzi)
**EN:**
> 1970s Polish crime comic style portrait of a 40-year-old project manager, slicked-back dark hair, tired eyes with forced confident smile, loosened striped tie, beige suit, holding a green status report folder, sweat drop on temple, office with wall charts behind him, bold ink outlines, flat retro palette, halftone dots, faded offset print, noir side lighting —ar 1:1 --style raw
**PL:** czterdziestoletni kierownik projektu, przylizane ciemne włosy, zmęczone oczy i wymuszony pewny uśmiech, poluzowany krawat w paski, beżowy garnitur, w dłoni zielona teczka z raportem, kropla potu na skroni, za nim biuro z wykresami na ścianie.

### 2. Beata Krajewska — Account Manager (czaruje i zmienia temat)
**EN:**
> 1970s Polish crime comic style portrait of an elegant saleswoman in her late 30s, voluminous 70s hairstyle, confident charming smile that doesn't reach the eyes, silk neck scarf, holding a telephone receiver with cord, contract papers on desk, bold ink outlines, flat retro palette (brick red accent), halftone dots, faded offset print, noir lighting —ar 1:1 --style raw
**PL:** elegancka handlowczyni pod czterdziestkę, bujna fryzura w stylu lat 70., czarujący uśmiech, który nie sięga oczu, jedwabna apaszka, w dłoni słuchawka telefonu z kablem, na biurku papiery kontraktu.

### 3. Tomek Wilk — Tech Lead (zgorzkniały, „a nie mówiłem")
**EN:**
> 1970s Polish crime comic style portrait of a bitter 35-year-old engineer, unkempt beard, rolled-up shirt sleeves, crossed arms, sarcastic raised eyebrow, thick-framed glasses, punch cards and a bulky 1970s computer terminal behind him, cigarette smoke in the air, bold ink outlines, flat retro palette (teal accent), halftone dots, faded offset print, noir lighting —ar 1:1 --style raw
**PL:** zgorzkniały 35-letni inżynier, nieporządna broda, podwinięte rękawy koszuli, skrzyżowane ramiona, sarkastycznie uniesiona brew, grube okulary, za nim karty perforowane i wielki terminal komputerowy z lat 70., smuga papierosowego dymu.

### 4. Iwona Stachura — PM klienta (zmęczona, lojalna)
**EN:**
> 1970s Polish crime comic style portrait of a weary but composed 45-year-old woman manager, hair in a practical bun, cardigan over blouse, holding a thick binder of requirements, guarded expression with tired eyes, factory-office window with warehouse in background, bold ink outlines, flat retro palette (mustard accent), halftone dots, faded offset print, noir lighting —ar 1:1 --style raw
**PL:** zmęczona, ale opanowana 45-letnia kierowniczka, włosy w praktycznym koku, kardigan na bluzce, w rękach gruby segregator z wymaganiami, czujne spojrzenie, za oknem hala magazynowa.

## Grafiki dodatkowe

### Okładka gry / ekran startowy
**EN:**
> 1970s Polish crime comic book cover, title composition: a dark office at night, desk lamp illuminating a case file labeled "FENIKS", four shadowy figures in the background each looking away from the others, dramatic diagonal composition, bold hand-lettered title area at top, flat retro palette, heavy ink shadows, halftone dots, faded offset print, vintage paper texture —ar 2:3 --style raw
**PL:** okładka komiksu kryminalnego z lat 70.: ciemne biuro nocą, lampka biurkowa oświetla teczkę z napisem „FENIKS", w tle cztery postacie w cieniu, każda patrzy w inną stronę, dramatyczna ukośna kompozycja, miejsce na ręcznie liternicowany tytuł u góry.

### Tło ekranu debriefu
**EN:**
> 1970s Polish crime comic style illustration, corkboard evidence wall with pinned documents, red string connecting photos of four suspects, magnifying glass on desk, moody single-bulb lighting, flat retro palette, bold ink outlines, halftone dots, faded offset print —ar 16:9 --style raw

## Uwagi techniczne per generator

- **Midjourney:** dodaj `--ar 1:1 --style raw` (portrety) / `--ar 2:3` (okładka); jeśli wychodzi zbyt fotorealistycznie, dopisz `--stylize 250` i wzmocnij frazę „flat comic illustration".
- **DALL-E 3:** wklej prompt EN bez parametrów `--`; poproś dodatkowo: „vector-like flat comic illustration, not photorealistic".
- **Stable Diffusion / Flux:** negative prompt: `photorealistic, 3d render, cgi, manga, anime, watercolor, modern office, smooth gradients, depth of field`.
- **Spójność serii:** generuj wszystkie cztery portrety w jednej sesji/seedzie (SD: ten sam seed ± wariacje; MJ: `--seed` + wspólny prompt bazowy). Paleta łączy się z UI gry (bursztyn/ciemny granat) — akcenty: Marek niebieski, Beata ceglasty, Tomek morski, Iwona musztardowy, jak kolory awatarów.
- **Prawa autorskie:** prompty odwołują się do STYLU epoki (polski komiks kryminalny lat 70.), nie do konkretnych kadrów czy postaci z chronionych serii — nie proś generatora o samego „Kapitana Żbika" ani o kopiowanie konkretnych rysowników.
