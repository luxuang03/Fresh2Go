# Fresh2Go

Applicazione web per la gestione della spesa online con ritiro programmato presso un supermercato.

## Tecnologie previste

- Vue.js per il frontend
- Node.js ed Express per il backend
- PostgreSQL per il database

## Pagine principali previste

L'applicazione Fresh2Go sarà organizzata come una single page application Vue.

Le pagine principali previste sono:

### Pagine pubbliche

- Home
- Login
- Registrazione
- Scelta supermercato
- Catalogo prodotti
- Dettaglio prodotto
- Ricette
- Dettaglio ricetta
- Carrello
- Checkout simulato

### Pagine utente

- Profilo
- Storico ordini
- Dettaglio ordine

## Flusso principale utente

Il flusso principale previsto è il seguente, con ordine indicativo perché nel flusso reale alcune azioni possono avvenire in momenti diversi:

1. L'utente entra nella Home.
2. Visualizza una breve presentazione del servizio.
3. Può registrarsi oppure effettuare il login.
4. Può scegliere un supermercato.
5. Dopo la scelta del supermercato accede al catalogo prodotti.
6. Nel catalogo può cercare e filtrare i prodotti.
7. Può aprire il dettaglio di un prodotto.
8. Può aggiungere prodotti al carrello.
9. Può consultare la sezione ricette.
10. Può aprire una ricetta e aggiungere gli ingredienti al carrello.
11. Dal carrello può modificare quantità o rimuovere prodotti.
12. Procede al checkout simulato.
13. Sceglie una fascia oraria di ritiro.
14. Conferma l'ordine.
15. Se loggato, può vedere l'ordine nello storico del profilo.

## Route Vue previste 

Le route indicate rappresentano una struttura iniziale e potranno cambiare durante lo sviluppo. In caso di modifiche, il README dovrà essere aggiornato per restare coerente con la struttura reale del progetto.

| Pagina | Path previsto | Scopo |
|---|---|---|
| Home | `/` | Presentazione del servizio |
| Login | `/login` | Accesso utente |
| Registrazione | `/register` | Creazione nuovo account |
| Supermercati | `/supermarkets` | Scelta del punto vendita |
| Catalogo | `/catalog` | Lista prodotti filtrabile |
| Dettaglio prodotto | `/products/:id` | Informazioni complete sul prodotto |
| Ricette | `/recipes` | Lista ricette disponibili |
| Dettaglio ricetta | `/recipes/:id` | Ingredienti e aggiunta al carrello |
| Carrello | `/cart` | Riepilogo prodotti selezionati |
| Checkout | `/cart/checkout` | Conferma ordine simulata a partire dal carrello |
| Profilo | `/profile` | Dati utente |
| Storico ordini | `/profile/orders` | Elenco ordini passati dell'utente |
| Dettaglio ordine | `/profile/orders/:id` | Dettaglio di un ordine specifico |

## Accesso alle pagine

Nella prima versione frontend le pagine saranno accessibili anche senza login reale, perché il progetto userà dati statici locali.

Nella versione finale:

- Home, Login, Registrazione, Supermercati, Catalogo, Dettaglio prodotto, Ricette e Dettaglio ricetta saranno pubbliche;
- Profilo, Storico ordini e Dettaglio ordine richiederanno login;
- Checkout funzionerà in forma simulata, ma nella versione finale salverà l'ordine associandolo all'utente se autenticato.

## Funzionalità previste

Le funzionalità indicate rappresentano una pianificazione iniziale del progetto.
Potranno essere aggiornate durante lo sviluppo, mantenendo il README coerente con la struttura reale dell'applicazione.

### Funzionalità minime

Le funzionalità minime rappresentano la prima versione funzionante del frontend, basata su dati statici locali.

- Home con presentazione del servizio;
- scelta di un supermercato;
- visualizzazione del catalogo prodotti;
- ricerca testuale dei prodotti;
- filtri principali del catalogo;
- dettaglio prodotto;
- aggiunta prodotti al carrello;
- modifica quantità nel carrello;
- rimozione prodotti dal carrello;
- calcolo totale del carrello;
- visualizzazione lista ricette;
- dettaglio ricetta;
- aggiunta ingredienti di una ricetta al carrello;
- checkout simulato;
- conferma ordine simulata.

### Funzionalità finali

Le funzionalità finali rappresentano la versione completa del progetto, con backend Express e database PostgreSQL.

- registrazione utente;
- login e logout;
- gestione della sessione utente;
- profilo utente;
- storico ordini;
- dettaglio ordine passato;
- catalogo prodotti recuperato dal database tramite API backend;
- ricette recuperate dal database tramite API backend;
- filtri prodotti collegati alle API;
- prodotti e ricette salvati su PostgreSQL;
- checkout con invio dell'ordine al backend;
- salvataggio ordine nel database;
- recupero degli ordini associati all'utente loggato;
- script SQL per ricreare schema e dati iniziali.

### Funzionalità secondarie

Le funzionalità secondarie saranno implementate solo dopo aver completato le funzionalità principali.

- prodotti preferiti;
- ripetizione di un ordine passato;
- geolocalizzazione simulata;
- gestione più avanzata degli slot di ritiro;
- miglioramento grafico delle card prodotto;
- miglioramento grafico delle card ricetta;
- pagina di errore per route non trovate;
- eventuali notifiche o messaggi di conferma più curati.

## Schema database previsto

Il progetto userà un database PostgreSQL.

Lo schema teorico sarà definito in modo più dettagliato nel file al percorso `database/README_DATABASE.md`.
Le tabelle principali previste riguardano utenti, supermercati, prodotti, categorie, allergeni, ricette, slot di ritiro, ordini, preferiti e sessioni utente.

