# Economics Conferences & Summer Schools Tracker

Un'applicazione web interattiva per scoprire, filtrare e visualizzare su mappa le migliori conferenze, workshop e summer school di economia a livello globale.

## Caratteristiche Principali
- **Mappa Interattiva (Leaflet):** Visualizzazione geografica degli eventi con popup leggibili contenenti link diretti al sito web di ciascuna conferenza.
- **Filtri di Ricerca:** Filtra gli eventi per tipologia (Conferenze, Workshop, Summer School), stato della scadenza (Open, Urgent) e ricerca testuale libera.
- **Statistiche in Tempo Reale:** Barra delle statistiche interattiva e cliccabile per filtrare rapidamente gli eventi in base ai conteggi.
- **Aggiornamento Automatico:** Script e workflow GitHub Actions configurati per mantenere i dati aggiornati nel tempo.

---

## Eseguire Localmente

### Prerequisiti
Assicurati di aver installato [Node.js](https://nodejs.org/).

### Installazione
1. Clona la repository:
   ```bash
   git clone <url-del-tuo-repo>
   cd econ-conferences
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```

### Avvio in Sviluppo
Avvia il server di sviluppo locale:
```bash
npm run dev
```
Apri [http://localhost:5173](http://localhost:5173) nel browser per visualizzare il sito.

---

## Aggiornamento Automatico dei Dati

Il progetto include un sistema di aggiornamento automatico dei dati che controlla le scadenze passate ed estrae i dettagli delle nuove edizioni.

### Come Funziona
Il file [.github/workflows/update-conferences.yml](.github/workflows/update-conferences.yml) esegue uno script una volta alla settimana (ogni domenica a mezzanotte):
1. **Fallback (Senza configurazione extra):** Se la data di fine di un evento è passata, lo script sposta automaticamente l'evento all'anno successivo incrementando le date di 1 anno per mantenerlo visibile.
2. **Aggiornamento Intelligente con AI (Consigliato):** Se configuri una chiave API di Gemini, lo script effettuerà una ricerca web in tempo reale (Google Search Grounding) per trovare le date effettive, le posizioni e le scadenze corrette della nuova edizione.

### Configurazione di Gemini (Opzionale)
Per attivare l'aggiornamento intelligente con AI:
1. Ottieni una chiave API gratuita da [Google AI Studio](https://aistudio.google.com/).
2. Vai nelle impostazioni del tuo repository GitHub: `Settings` > `Secrets and variables` > `Actions`.
3. Crea un nuovo **Repository Secret** chiamato `GEMINI_API_KEY` e inserisci la tua chiave API come valore.

### Esecuzione Manuale
Puoi forzare il controllo degli aggiornamenti in qualsiasi momento:
- **Su GitHub:** Vai alla scheda `Actions` del repository, seleziona `Weekly Conference Update` e clicca su `Run workflow`.
- **In Locale:** Esegui il comando (assicurandoti di definire la chiave API se desideri l'AI):
  ```bash
  # In Windows PowerShell:
  $env:GEMINI_API_KEY="la_tua_chiave_qui"; node scripts/auto-update.js
  
  # In Bash (Mac/Linux):
  GEMINI_API_KEY="la_tua_chiave_qui" node scripts/auto-update.js
  ```
