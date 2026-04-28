# Database

Questa cartella conterrà gli script SQL necessari per creare e popolare il database PostgreSQL del progetto Fresh2Go.

## File previsti

- `01_schema.sql`: conterrà la creazione delle tabelle, delle chiavi primarie, delle chiavi esterne e dei vincoli principali.
- `02_seed.sql`: conterrà i dati iniziali necessari per testare l'applicazione.

## Tabelle previste

Le seguenti voci sono nomi di tabelle previste nello schema teorico del database.

| Tabella | Scopo |
|-------|-------|
| `users` | Salva gli utenti registrati |
| `supermarkets` | Salva i supermercati disponibili |
| `categories` | Salva le categorie dei prodotti |
| `products` | Salva i prodotti del catalogo generale |
| `supermarket_products` | Collega prodotti e supermercati, gestendo disponibilità e stock |
| `allergens` | Salva gli allergeni standard |
| `product_allergens` | Collega prodotti e allergeni |
| `recipes` | Salva le ricette disponibili |
| `recipe_ingredients` | Collega ricette e prodotti usati come ingredienti |
| `pickup_slots` | Salva le fasce orarie di ritiro |
| `orders` | Salva gli ordini confermati |
| `order_items` | Salva i prodotti contenuti in ogni ordine |
| `user_favorites` | Salva i prodotti preferiti dagli utenti |
| `sessions` | Salva le sessioni utente, se gestite tramite database |

## Relazioni principali

- `users` → `orders`: un utente può avere più ordini.
- `supermarkets` → `pickup_slots`: un supermercato può avere più fasce orarie di ritiro.
- `categories` → `products`: una categoria può contenere più prodotti.
- `supermarkets` ↔ `products`: relazione molti-a-molti gestita da `supermarket_products`.
- `products` ↔ `allergens`: relazione molti-a-molti gestita da `product_allergens`.
- `recipes` ↔ `products`: relazione molti-a-molti gestita da `recipe_ingredients`.
- `orders` → `order_items`: un ordine contiene più righe ordine.
- `users` ↔ `products`: relazione molti-a-molti gestita da `user_favorites`.

## Note

Lo schema indicato è ancora teorico.
La struttura definitiva sarà implementata più avanti nel file `01_schema.sql`.

Il file `02_seed.sql` conterrà invece i dati iniziali, come supermercati, categorie, prodotti, allergeni, ricette e slot di ritiro.