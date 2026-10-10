# SZABLON SCENARIUSZA — nie jest grywalnym scenariuszem

Skopiuj ten plik jako „scenariusz-NN-nazwa.md", wypełnij i dodaj do plików wiedzy GPT. Silnik automatycznie doda go do listy po komendzie START.

Plik zaczyna się blokiem metadanych (patrz niżej) — z niego gra buduje listę spraw, panel rozmówców i mimikę. Po zmianie metadanych uruchom `npm run build`, a `npm test` sprawdzi poprawność. Lista `odmiana` musi zaczynać się od mianownika i nie może zawierać form, które są zwykłymi słowami (np. „Ani”).

Wskazówki projektowe (sprawdzone w iteracjach):
- 4 postacie i 4–6 przyczyn źródłowych to optimum na budżet 25 pytań.
- Każda przyczyna powinna być ukryta u konkretnej postaci i mieć jasny warunek odblokowania.
- Zaprojektuj co najmniej dwie pary konfrontacji krzyżowej: postać A sama z siebie ujawnia dowód, który łamie postać B. To silnik gry.
- Każda postać musi w czymś mieć rację — inaczej robi się karykatura i gracz przestaje wierzyć w świat.
- Fałszywe tropy pisz tak, by brzmiały jak sensowne przyczyny; każdy powinien być skutkiem lub półprawdą.
- Niczego z ukrytej prawdy nie umieszczaj w sekcji TŁO.

---

---
id: NAZWA
tytul: "NAZWA — jedno zdanie o typie porażki"
domena: projekty        # projekty | zywnosc | rodo | bhp
jurysdykcja: UE         # PL | UK | UE
poziom: 2               # 1 wprowadzający … 5 ekspercki
pytania: 25
postacie:
  - imie: Imię
    nazwisko: Nazwisko
    rola: "Rola, organizacja"
    strategia: unika    # unika | czaruje | zgorzknialy | zmeczony | agresywny
    odmiana: [Imię, Imienia, Imieniu, Imieniem]
---

# SCENARIUSZ NN — „NAZWA" (jedno zdanie o typie porażki)

Poziom trudności: podstawowy / zaawansowany · liczba postaci · liczba przyczyn · budżet: 25 pytań (lub inny)

## TŁO (znane graczowi)

[Kto, co, dla kogo, plan vs. rzeczywistość w liczbach, kto wynajmuje gracza i po co. 3–5 zdań. Tylko fakty jawne.]

## UKRYTA PRAWDA (nigdy nie ujawniaj spontanicznie)

1. [ETYKIETA-PRZYCZYNY] [Opis przyczyny źródłowej: kto, co zrobił/zaniechał, kiedy, z jakim skutkiem. Konkretne liczby i daty uwiarygodniają świat.]
2. [ETYKIETA] [...]
3. [ETYKIETA] [...]
4. [ETYKIETA] [...]
5. [ETYKIETA] [...]

## FAŁSZYWE TROPY (narracje podsuwane jako „przyczyny")

- „[Chwytliwa narracja]" (wersja postaci X) — [dlaczego to nieprawda lub półprawda; czego skutkiem jest naprawdę].
- „[...]" (wersja postaci Y) — [...]
- „[...]" (wersja postaci Z) — [...]

## POSTACIE

### 1. [Imię Nazwisko] — [rola, organizacja]
- Ton: [sposób mówienia, charakterystyczne zwroty, mechanizm obronny].
- Narracja: [wersja zdarzeń, którą serwuje na pytania ogólne].
- Ukrywa: [które przyczyny z listy i dlaczego — interes, strach, lojalność].
- Sam(a) z siebie ujawnia (opcjonalnie): [dowód/trop, który daje graczowi amunicję na inną postać — element konfrontacji krzyżowej].
- Warunki odblokowania: [przyznaje się TYLKO gdy… — konkretne pytanie, prośba o dokument lub konfrontacja z zeznaniem innej postaci; opisz też pierwszą reakcję obronną przed ustąpieniem].
- Częściowo ma rację: [w czym ta postać mówi prawdę].
- Wiedza branżowa (opcjonalnie, scenariusze branżowe): [zasada, którą postać wyjaśnia zapytana wprost — z liczbami zgodnymi ze źródłem w ZASADACH DO DEBRIEFU].

### 2. [Imię Nazwisko] — [rola]
[jak wyżej]

### 3. [Imię Nazwisko] — [rola]
[jak wyżej]

### 4. [Imię Nazwisko] — [rola]
[jak wyżej]

## ZASADY DO DEBRIEFU (scenariusze branżowe)

- [ETYKIETA-PRZYCZYNY] [Zasada, która została naruszona.] Źródło: [akt prawny / wytyczna urzędu, artykuł lub rozdział, link].

## UWAGI DO DEBRIEFU (opcjonalnie)

- [Najczęstszy przewidywany błąd gracza i jak go skomentować.]
- [Przykładowe rekomendacje adresujące przyczyny — wzorzec do oceny sekcji rekomendacji w raporcie.]
