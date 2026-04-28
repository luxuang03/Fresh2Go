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

Il flusso principale previsto è il seguente(ordine indicativo dato che nel flusso reale alcune azioni possono avvenire in ordine diverso):

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

## Route Vue previste (pò cambiare durante lo sviluppo, ricontrollare)

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