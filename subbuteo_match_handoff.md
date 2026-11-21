# ⚽ Subbuteo Match - Project Handoff

## 📌 Panoramica del Progetto
**Subbuteo Match** è una Web App (PWA) progettata per fornire un tabellone segnapunti, un cronometro e una gestione eventi per le partite di Subbuteo da tavolo. È pensata per essere usata principalmente su dispositivi mobile (in particolare iOS via Safari), supportando l'installazione sulla schermata Home e l'utilizzo al 100% offline.

## 🛠 Tech Stack
- **Frontend:** HTML5, Vanilla JavaScript.
- **Styling:** Tailwind CSS compilato in `tailwind.css`, senza runtime CDN.
- **Font:** Bebas Neue, Oswald e Inter da Google Fonts se disponibili; fallback locali offline.
- **Audio:** Fischi sintetizzati con Web Audio API e registrazioni da stadio in MP3 locali, con un boato sintetico di riserva.
- **PWA / Offline:** Service worker `sw.js`, manifest statico e icone locali.

## 📁 Struttura del Codice
Il layout, gli stili personalizzati e la logica applicativa rimangono in `index.html`; gli asset PWA e il CSS compilato sono serviti come file statici.
1.  **`<style>`:** Definisce variabili colore, animazioni 3D per le flip-card dei punteggi, effetti glow per i gol e stili personalizzati (es. scrollbar).
2.  **`<body>` / Layout:** Strutturato con CSS Grid/Flexbox e classi Tailwind responsive (`landscape:`) per adattarsi fluidamente sia alla modalità verticale (Portrait) che orizzontale (Landscape).
3.  **`<script>`:** Contiene tutta la logica applicativa, divisa in moduli logici:
    -   *PWA Setup:* Registrazione di `sw.js` sullo stesso origin, con scope relativo alla directory dell'app.
    -   *State Management:* Oggetto `state` globale salvato costantemente in `localStorage`.
    -   *Audio Engine:* Fischi (singolo, metà tempo, fine), sottofondo in loop legato al cronometro e boato su evento gol.
    -   *Game Logic:* Countdown basato sull'ora di scadenza, tempi supplementari, aggiornamento UI, storico match e formattazione condivisione.

## ✨ Funzionalità Principali
*   **Cronometro Avanzato:** Supporta avvio, pausa, regolazione manuale (+/-) e gestione automatica dei tempi (1° Tempo, 2° Tempo, Supplementari).
*   **Audio da stadio:** Il sottofondo si ferma in pausa, a fine tempo e con il mute. Il boato del gol rispetta anche la sua impostazione dedicata.
*   **Gestione Punteggio:** Tasti rapidi "+ GOL" (con animazione e boato) e "-" (per annullare reti erronee).
*   **Design Responsive:** Il layout si riorganizza automaticamente: in orizzontale il cronometro si piazza al centro tra le due squadre, in verticale occupa la parte superiore.
*   **Colori Personalizzabili:** Preset e color picker nativo per modificare la base e le maglie delle miniature SVG.
*   **Wake Lock API:** Mantiene lo schermo dell'iPhone acceso durante lo scorrimento del timer.
*   **Condivisione & Storico:** Tabellino cronologico degli eventi copiabile negli appunti o condivisibile tramite le API native di iOS.

## 🚀 Deployment e Offline
Pubblicare `index.html`, `tailwind.css`, `sw.js`, `manifest.webmanifest`, le icone e la cartella `audio/` su **GitHub Pages**, mantenendo la struttura delle directory. Per provare la PWA in locale, usare un server su `localhost`; l'apertura diretta del file HTML non registra il service worker.
*   **Stili:** Dopo modifiche alle classi Tailwind, rigenerare `tailwind.css` con `npx --yes tailwindcss@3.4.17 --content ./index.html --output ./tailwind.css --minify`.
*   **Aggiornamenti:** Quando cambia un file precache, incrementare la versione di `cacheName` in `sw.js` e pubblicare gli asset insieme. Chiudere le schede della vecchia versione per permettere l'attivazione del nuovo worker.
*   **Failsafe Offline:** Dopo un primo caricamento online e l'attivazione del worker, il tabellone e gli asset locali sono disponibili offline. La navigazione torna alla copia in cache anche in caso di `404` sulla pagina dell'app.
*   **Verifica su iPhone:** Da Safari, aggiungere l'app alla schermata Home, riaprirla in modalità aereo e verificare cronometro, audio, rotazione e wake lock.

## Crediti audio
- `audio/stadium-ambience.mp3`: montaggio con dissolvenze di [LIVE Football Match - Stadium Crowd Cheering](https://pixabay.com/sound-effects/people-live-football-match-stadium-crowd-cheering-563439/) di arunangshubanerjee e [Soccer Stadium 10](https://pixabay.com/sound-effects/city-soccer-stadium-10-6709/) di Sandermotions (Freesound), pubblicata da freesound_community.
- `audio/goal-roar.mp3`: estratto da 6,75 a 11,25 secondi di [Crowd Cheering in Stadium](https://pixabay.com/sound-effects/people-crowd-cheering-in-stadium-435357/) di vishiv.
- Sorgenti pubblicate con la [Pixabay Content License](https://pixabay.com/service/license-summary/).

## 📝 Next Steps (Idee per sviluppi futuri)
*   [ ] Aggiunta di cartellini (Giallo/Rosso) nel tabellino dello storico.
*   [ ] Implementazione di rigori (calci di rigore a fine partita).
*   [ ] Refactoring in bundle (es. Vite/React) se il codice JS dovesse crescere oltre le 1500 righe.