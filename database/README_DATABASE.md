# Database Fresh2Go

Questa cartella contiene gli script SQL usati per creare e popolare il database PostgreSQL del progetto Fresh2Go.

Durante lo sviluppo stiamo usando Supabase, ma il database resta un database PostgreSQL.  
Gli script presenti in questa cartella servono anche per ricreare il database da zero in un altro ambiente PostgreSQL.

## File presenti

- `01_schema.sql`: crea le tabelle principali del database, con chiavi primarie, chiavi esterne e vincoli.
- `02_seed.sql`: inserisce i dati iniziali usati per testare l'applicazione.


## Ordine di esecuzione

Per ricreare il database bisogna eseguire gli script in questo ordine:

1. `01_schema.sql`
2. `02_seed.sql`

Il primo file crea la struttura delle tabelle.  
Il secondo file inserisce i dati iniziali.


## Tabelle create

Le tabelle attualmente create dallo schema sono:

| Tabella | Scopo |
|---|---|
| `users` | Salva gli utenti demo e, in futuro, gli utenti registrati |
| `supermarkets` | Salva i supermercati disponibili |
| `categories` | Salva le categorie dei prodotti |
| `products` | Salva i prodotti del catalogo generale |
| `supermarket_products` | Collega prodotti e supermercati, gestendo stock e disponibilità |
| `allergens` | Salva gli allergeni standard |
| `product_allergens` | Collega prodotti e allergeni |
| `recipes` | Salva le ricette disponibili |
| `recipe_ingredients` | Collega ricette e prodotti usati come ingredienti |
| `pickup_slots` | Salva le fasce orarie di ritiro per ogni supermercato |

Altre tabelle previste dal progetto, come ordini, preferiti e sessioni, verranno aggiunte nelle fasi successive.

## Dati inseriti dal seed

Il file `02_seed.sql` inserisce dati iniziali per testare il progetto:

- 2 utenti demo;
- 3 supermercati;
- 8 categorie prodotto;
- 11 allergeni;
- 22 prodotti;
- collegamenti tra prodotti e supermercati;
- collegamenti tra prodotti e allergeni;
- 8 ricette mock;
- ingredienti collegati alle ricette;
- 24 slot di ritiro demo.

Gli slot di ritiro usano `CURRENT_DATE` e `CURRENT_DATE + 1`, quindi vengono creati per oggi e domani rispetto al giorno in cui viene eseguito il seed.

## Query di controllo

Dopo aver eseguito `01_schema.sql` e `02_seed.sql`, si possono usare alcune query semplici per controllare che i dati principali siano stati inseriti correttamente.

```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM recipes;
SELECT COUNT(*) FROM pickup_slots;
SELECT COUNT(*) FROM users;
```

Risultati attesi:

| Tabella | Righe attese |
|---|---:|
| `products` | 22 |
| `recipes` | 8 |
| `pickup_slots` | 24 |
| `users` | 2 |