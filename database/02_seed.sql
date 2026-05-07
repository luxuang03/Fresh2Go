-- Fresh2Go - Seed database
-- Dati iniziali:
-- categorie, allergeni, supermercati

DELETE FROM supermarkets;
DELETE FROM allergens;
DELETE FROM categories;

ALTER SEQUENCE supermarkets_id_seq RESTART WITH 1;
ALTER SEQUENCE allergens_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Categorie prodotti
INSERT INTO categories (id, name, description, parent_id)
VALUES
(1, 'Frutta e verdura', 'Prodotti freschi, ortaggi e frutta di stagione.', NULL),
(2, 'Pasta, riso e cereali', 'Pasta, riso, farine, cereali e prodotti simili.', NULL),
(3, 'Latticini e uova', 'Latte, formaggi, yogurt, burro e uova.', NULL),
(4, 'Carne, pesce e alternative vegetali', 'Carne, pesce fresco e prodotti proteici vegetali.', NULL),
(5, 'Surgelati', 'Prodotti congelati e pronti da conservare in freezer.', NULL),
(6, 'Bevande', 'Acqua, succhi, bibite e bevande varie.', NULL),
(7, 'Dolci e snack', 'Biscotti, merendine, cioccolato, snack dolci e salati.', NULL),
(8, 'Prodotti per la casa e igiene', 'Detersivi, carta, prodotti per pulizia e igiene personale.', NULL);

-- Dopo aver inserito ID manuali, aggiorniamo la sequenza.
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Allergeni
INSERT INTO allergens (id, name, label, description)
VALUES
(1, 'glutine', 'Glutine', 'Presente in grano, orzo, segale e prodotti derivati.'),
(2, 'latte', 'Latte', 'Presente in latte, formaggi, burro, yogurt e derivati.'),
(3, 'uova', 'Uova', 'Presente in uova e prodotti che le contengono.'),
(4, 'arachidi', 'Arachidi', 'Presente in arachidi e prodotti derivati.'),
(5, 'frutta-a-guscio', 'Frutta a guscio', 'Presente in mandorle, nocciole, noci e simili.'),
(6, 'soia', 'Soia', 'Presente in soia e prodotti derivati.'),
(7, 'pesce', 'Pesce', 'Presente in pesce fresco, conservato o trasformato.'),
(8, 'crostacei', 'Crostacei', 'Presente in gamberi, scampi, granchi e simili.'),
(9, 'sedano', 'Sedano', 'Presente in sedano e preparazioni che lo contengono.'),
(10, 'senape', 'Senape', 'Presente in senape e salse derivate.'),
(11, 'sesamo', 'Sesamo', 'Presente in semi di sesamo e prodotti derivati.');

SELECT setval('allergens_id_seq', (SELECT MAX(id) FROM allergens));

-- Supermercati
INSERT INTO supermarkets (
    id,
    name,
    address,
    city,
    latitude,
    longitude,
    opening_time,
    closing_time,
    is_active
)
VALUES
(
    1,
    'Fresh2Go Market Centro',
    'Via Roma 25',
    'Roma',
    NULL,
    NULL,
    '08:00',
    '20:00',
    TRUE
),
(
    2,
    'Fresh2Go Express Nord',
    'Via Flaminia 180',
    'Roma',
    NULL,
    NULL,
    '07:30',
    '21:00',
    TRUE
),
(
    3,
    'Fresh2Go Bio Sud',
    'Via Appia Nuova 420',
    'Roma',
    NULL,
    NULL,
    '08:30',
    '19:30',
    TRUE
);

SELECT setval('supermarkets_id_seq', (SELECT MAX(id) FROM supermarkets));