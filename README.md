# Greta & Matteo — Sito di matrimonio

Pagina web statica per il matrimonio di Greta e Matteo (05/09/2026). Nessun framework, nessuna dipendenza npm, nessun build step.

| File | Contenuto |
|---|---|
| `index.html` | Markup della pagina |
| `style.css` | Stili |
| `script.js` | Countdown, scroll reveal, toggle RSVP e submit Forminit |

---

## Struttura della pagina

| Sezione | Anchor | Descrizione |
|---|---|---|
| Nav | — | Barra fissa in cima con link alle tre sezioni |
| Hero | `#hero` | Nomi, data, tagline e countdown live |
| Programma | `#evento` | Timeline verticale con orari e location |
| Dove dormire | `#hotel` | Griglia di card hotel con link a Booking/Airbnb |
| RSVP | `#rsvp` | Form di conferma presenza inviato a Forminit |
| Footer | — | Nomi, data e email di contatto |

---

## Design

**Font** (Google Fonts, preconnect ottimizzato):
- `Cormorant Garamond` — titoli e display, pesi 300/400/600 con varianti italic
- `Jost` — testo corrente e UI, pesi 300/400/500

**Palette** (CSS custom properties in `:root`):

| Variabile | Valore | Uso |
|---|---|---|
| `--ivory` | `#faf8f4` | Sfondo principale |
| `--cream` | `#f2ede4` | Sfondo sezione RSVP e card hotel |
| `--gold` | `#b8975a` | Colore primario accento |
| `--gold-lt` | `#d4b97a` | Gold chiaro (gradienti) |
| `--gold-dk` | `#8a6d3b` | Gold scuro (hover) |
| `--ink` | `#2c2720` | Testo principale |
| `--ink-lt` | `#6b5f52` | Testo secondario |
| `--border` | `rgba(184,151,90,0.3)` | Bordi e separatori |

---

## Funzionalità JavaScript

### Countdown
Aggiorna ogni secondo i quattro elementi `#cd-days`, `#cd-hours`, `#cd-min`, `#cd-sec` calcolando la differenza rispetto a `2026-09-05T15:00:00`. Quando il target è raggiunto mostra tutti zeri.

### Scroll reveal
`IntersectionObserver` (threshold 0.12) aggiunge la classe `.visible` agli elementi `.reveal` quando entrano nel viewport, attivando una transizione CSS `opacity` + `translateY`.

### Toggle campi condizionali
Le sezioni "Numero di accompagnatori" e "Intolleranze o note alimentari" sono raggruppate nel div `#attendeeDetails` con `display: contents` (così i figli partecipano direttamente alla grid del form). Quando si seleziona "Purtroppo non posso" viene aggiunta la classe `.hidden` che applica `display: none`; quando si seleziona "Sì, ci sarò!" la classe viene rimossa.

---

## Form RSVP

### Campi

| Campo | Tipo | Note |
|---|---|---|
| Nome / Cognome | `text` | Obbligatori |
| Email | `email` | Obbligatorio |
| Sarai presente? | radio | Controlla visibilità `#attendeeDetails` |
| Numero accompagnatori | `select` | Visibile solo se presente |
| Intolleranze o note alimentari | `text` | Visibile solo se presente; chiede di indicare il numero di ospiti coinvolti |
| Messaggio per gli sposi | `textarea` | Sempre visibile |

### Stile controlli custom
I radio button sono completamente ridisegnati via `appearance: none`:
- Riquadro 18×18px, bordo gold, `border-radius: 0`
- Al check: sfondo gold con dot quadrato bianco centrato via `top/left: 50% + translate(-50%, -50%)`

### Invio — Forminit API
I campi del form usano la naming convention di Forminit (prefisso `fi-<tipo>-<proprietà>`, es. `fi-sender-email`, `fi-radio-presenza`, `fi-text-intolleranze`). Il submit è gestito da un `async` event listener che:
1. Verifica il campo honeypot (vedi sotto); se valorizzato, simula successo senza chiamare Forminit
2. Costruisce un `FormData` dal form
3. Invia il `FormData` tramite l'SDK `Forminit` (`forminit.submit(formId, formData)`) caricato da `https://forminit.com/sdk/v1/forminit.js`, verso il form con ID `r1yust14zjn`
4. In caso di successo: nasconde il form e mostra `#formSuccess`
5. In caso di errore: mostra `#formError` e riabilita il bottone

### Anti-bot
Il form è protetto da reCAPTCHA v3.

---

## Deploy

Il sito è composto da `index.html`, `style.css` e `script.js`, senza altri asset esterni locali. È sufficiente hostarlo su qualsiasi CDN statica (GitHub Pages, Netlify, Vercel, ecc.) puntando la root alla cartella.
