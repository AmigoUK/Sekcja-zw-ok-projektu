# Sekcja zwłok projektu

Narracyjna gra edukacyjna: wcielasz się w facylitatora post-mortem i przesłuchujesz AI odgrywające członków upadłego projektu. Uczy analizy przyczyn źródłowych, pytań otwartych i odróżniania faktów od narracji.

![Zrzut ekranu gry](game-staged.png)

## Struktura repozytorium

- `sekcja-zwlok.html` — gra (jeden plik, zero backendu). Obsługiwane silniki AI: Anthropic, OpenAI, GLM/Zhipu, DeepSeek, Groq (Llama) oraz lokalne: LM Studio, Ollama, llama.cpp i dowolny endpoint OpenAI-compatible. Ranking z autoryzacją mailową (tryb demo bez backendu), regulamin i polityka prywatności wbudowane.
- `ranking-server.js` — backend rankingu (Node.js + express + nodemailer): kody na email, maskowanie adresów (3 pierwsze + 3 ostatnie znaki), leaderboard. Konfiguracja w komentarzu na górze pliku.
- `system-prompt.md` — pełny prompt jednoplikowy (scenariusz FENIKS) do wklejenia w dowolny czat LLM.
- `gpt/` — pakiet Custom GPT: `gpt-master-prompt.md` (Instructions, <8000 znaków) + 6 scenariuszy, talia modyfikatorów losowych i szablon scenariusza (pliki wiedzy).
- `img/` — grafiki w stylu polskiego komiksu kryminalnego lat 70. (opis niżej).
- `prompty-grafiki.md` — prompty do generatorów obrazu użyte do stworzenia grafik.
- `koncept.md` — pełny koncept narzędzia (mechanika, analiza wartości, wnioski z iteracji, plan screencastu).
- `deck.js` + `sekcja-zwlok-prezentacja.pptx` — generator i gotowa prezentacja konceptu.

## Grafiki

| Ścieżka | Zawartość |
|---|---|
| `img/marek.png`, `beata.png`, `tomek.png`, `iwona.png` | Portrety czwórki przesłuchiwanych, 384×384. Gra podmienia nimi inicjały w panelu „Rozmówcy"; jeśli pliku brak, `onerror` cofa avatar do inicjałów. |
| `img/emocje/<postać>-<emocja>.jpg` | 20 wariantów mimiki, 768×768. Emocje: `radosc`, `zlosc`, `zaskoczenie`, `smutek`, `rezygnacja`. Wariant neutralny to portret główny z wiersza wyżej. Materiał na kolejną wersję — obecna gra ich nie używa. |
| `img/okladka.jpg` | Okładka „FENIKS — gra śledcza", 2:3. |
| `img/tlo-debriefu.jpg` | Ściana dowodów z czerwonymi sznurkami, 16:9. |

Grafiki w repozytorium są przeskalowane pod web. Oryginały 1254×1254 nie są wersjonowane — raster halftone kompresuje się fatalnie w PNG (~3,3 MB na plik).

## Szybki start

Otwórz `sekcja-zwlok.html` w przeglądarce, wybierz silnik AI, wklej klucz (lub uruchom lokalny serwer modelu) i kliknij „Rozpocznij śledztwo".

Ranking ogólny: uruchom `ranking-server.js` i ustaw `RANKING_API` na początku skryptu w `sekcja-zwlok.html`.

```
npm install
SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... \
MAIL_FROM="Sekcja Zwłok <ranking@example.com>" PORT=3001 npm start
```

Bez zmiennych SMTP serwer działa w trybie deweloperskim (kody logowane na konsolę zamiast wysyłane mailem). Plik `ranking-data.json` z wynikami powstaje obok serwera i jest celowo wykluczony z repozytorium — zawiera pełne adresy e-mail graczy.

## Licencja

MIT — patrz [LICENSE](LICENSE).
