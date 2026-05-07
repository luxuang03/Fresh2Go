-- Fresh2Go - Seed database
-- Dati iniziali:
-- categorie, allergeni, supermercati

DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM product_allergens;
DELETE FROM supermarket_products;
DELETE FROM pickup_slots;
DELETE FROM products;
DELETE FROM supermarkets;
DELETE FROM allergens;
DELETE FROM categories;
DELETE FROM users;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE pickup_slots_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_ingredients_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE supermarkets_id_seq RESTART WITH 1;
ALTER SEQUENCE allergens_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Utenti demo
-- Per ora sono usati solo come dati di test.
-- Le password reali verranno gestite più avanti con bcrypt.
INSERT INTO users (
    id,
    username,
    email,
    password_hash,
    full_name,
    phone
)
VALUES
(
    1,
    'mario.rossi',
    'mario.rossi@example.com',
    'demo_hash_mario',
    'Mario Rossi',
    '3331234567'
),
(
    2,
    'giulia.bianchi',
    'giulia.bianchi@example.com',
    'demo_hash_giulia',
    'Giulia Bianchi',
    '3337654321'
);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

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

-- Prodotti
INSERT INTO products (
    id,
    category_id,
    name,
    brand,
    description,
    ingredients,
    price,
    discount_percentage,
    image_url,
    unit_label,
    is_vegetarian,
    is_vegan
)
VALUES
(1, 1, 'Mele Golden', 'Fresh2Go', 'Mele Golden fresche, dolci e croccanti.', 'Mele', 2.49, 0, '', 'kg', TRUE, TRUE),
(2, 1, 'Banane', 'Fresh2Go', 'Banane mature al punto giusto.', 'Banane', 1.89, 10, '', 'kg', TRUE, TRUE),
(3, 1, 'Insalata mista', 'Orto Pronto', 'Insalata pronta da lavare e condire.', 'Lattuga, radicchio, carote', 1.99, 0, '', 'busta', TRUE, TRUE),
(4, 2, 'Pasta spaghetti', 'Granoro', 'Spaghetti di semola di grano duro.', 'Semola di grano duro, acqua', 1.29, 0, '', '500 g', TRUE, TRUE),
(5, 2, 'Riso Carnaroli', 'Riserva Verde', 'Riso ideale per risotti.', 'Riso Carnaroli', 2.79, 5, '', '1 kg', TRUE, TRUE),
(6, 2, 'Pane integrale', 'Forno Fresco', 'Pane integrale confezionato.', 'Farina integrale, acqua, lievito, sale', 2.19, 0, '', '400 g', TRUE, TRUE),
(7, 3, 'Latte parzialmente scremato', 'LatteRoma', 'Latte fresco parzialmente scremato.', 'Latte', 1.59, 0, '', '1 l', TRUE, FALSE),
(8, 3, 'Yogurt bianco', 'LatteRoma', 'Yogurt bianco naturale.', 'Latte, fermenti lattici', 1.25, 15, '', '2 x 125 g', TRUE, FALSE),
(9, 3, 'Uova fresche', 'Aia Verde', 'Confezione da 6 uova fresche.', 'Uova', 2.69, 0, '', '6 pezzi', TRUE, FALSE),
(10, 4, 'Petto di pollo', 'Carni Scelte', 'Petto di pollo a fette.', 'Carne di pollo', 6.49, 8, '', '500 g', FALSE, FALSE),
(11, 4, 'Filetti di salmone', 'Mare Vivo', 'Filetti di salmone fresco.', 'Salmone', 9.99, 0, '', '300 g', FALSE, FALSE),
(12, 4, 'Burger vegetale', 'Green Food', 'Burger vegetale a base di soia.', 'Proteine di soia, verdure, spezie', 3.99, 10, '', '2 pezzi', TRUE, TRUE),
(13, 5, 'Piselli surgelati', 'Orto Gelo', 'Piselli fini surgelati.', 'Piselli', 2.29, 0, '', '450 g', TRUE, TRUE),
(14, 5, 'Pizza margherita surgelata', 'Forno Gelo', 'Pizza margherita surgelata pronta da cuocere.', 'Farina, pomodoro, mozzarella, olio', 3.49, 20, '', '1 pezzo', TRUE, FALSE),
(15, 5, 'Gelato alla vaniglia', 'Dolce Neve', 'Gelato alla vaniglia in vaschetta.', 'Latte, panna, zucchero, vaniglia', 4.29, 0, '', '500 g', TRUE, FALSE),
(16, 6, 'Acqua naturale', 'Fonte Chiara', 'Acqua naturale in bottiglia.', 'Acqua minerale naturale', 0.39, 0, '', '1.5 l', TRUE, TRUE),
(17, 6, 'Succo d’arancia', 'Fruit Joy', 'Succo d’arancia senza zuccheri aggiunti.', 'Succo d’arancia', 1.89, 5, '', '1 l', TRUE, TRUE),
(18, 7, 'Biscotti al cacao', 'Dolce Mattino', 'Biscotti al cacao per colazione.', 'Farina, cacao, zucchero, uova', 2.49, 0, '', '350 g', TRUE, FALSE),
(19, 7, 'Cioccolato fondente', 'Cacao Nero', 'Tavoletta di cioccolato fondente 70%.', 'Cacao, zucchero, burro di cacao', 1.99, 10, '', '100 g', TRUE, TRUE),
(20, 7, 'Patatine classiche', 'Snack Più', 'Patatine croccanti leggermente salate.', 'Patate, olio di semi, sale', 1.69, 0, '', '150 g', TRUE, TRUE),
(21, 8, 'Detersivo piatti', 'Casa Pulita', 'Detersivo liquido per piatti al limone.', '', 1.79, 0, '', '500 ml', FALSE, FALSE),
(22, 8, 'Carta igienica', 'Soft Casa', 'Carta igienica morbida a 3 veli.', '', 3.49, 12, '', '4 rotoli', FALSE, FALSE);

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- Collegamento prodotti-supermercati
INSERT INTO supermarket_products (
    supermarket_id,
    product_id,
    stock_quantity,
    is_available,
    local_price
)
VALUES
(1, 1, 40, TRUE, NULL),
(2, 1, 40, TRUE, NULL),
(3, 1, 40, TRUE, NULL),
(1, 2, 35, TRUE, NULL),
(2, 2, 35, TRUE, NULL),
(1, 3, 22, TRUE, NULL),
(3, 3, 22, TRUE, NULL),
(1, 4, 60, TRUE, NULL),
(2, 4, 60, TRUE, NULL),
(3, 4, 60, TRUE, NULL),
(1, 5, 28, TRUE, NULL),
(2, 5, 28, TRUE, NULL),
(3, 5, 28, TRUE, NULL),
(1, 6, 18, TRUE, NULL),
(2, 6, 18, TRUE, NULL),
(1, 7, 45, TRUE, NULL),
(2, 7, 45, TRUE, NULL),
(3, 7, 45, TRUE, NULL),
(1, 8, 30, TRUE, NULL),
(2, 8, 30, TRUE, NULL),
(1, 9, 24, TRUE, NULL),
(2, 9, 24, TRUE, NULL),
(3, 9, 24, TRUE, NULL),
(1, 10, 16, TRUE, NULL),
(2, 10, 16, TRUE, NULL),
(1, 11, 12, TRUE, NULL),
(2, 11, 12, TRUE, NULL),
(1, 12, 20, TRUE, NULL),
(3, 12, 20, TRUE, NULL),
(1, 13, 32, TRUE, NULL),
(2, 13, 32, TRUE, NULL),
(3, 13, 32, TRUE, NULL),
(1, 14, 26, TRUE, NULL),
(2, 14, 26, TRUE, NULL),
(1, 15, 15, TRUE, NULL),
(3, 15, 15, TRUE, NULL),
(1, 16, 100, TRUE, NULL),
(2, 16, 100, TRUE, NULL),
(3, 16, 100, TRUE, NULL),
(1, 17, 38, TRUE, NULL),
(2, 17, 38, TRUE, NULL),
(3, 17, 38, TRUE, NULL),
(1, 18, 25, TRUE, NULL),
(2, 18, 25, TRUE, NULL),
(1, 19, 34, TRUE, NULL),
(3, 19, 34, TRUE, NULL),
(1, 20, 42, TRUE, NULL),
(2, 20, 42, TRUE, NULL),
(1, 21, 30, TRUE, NULL),
(2, 21, 30, TRUE, NULL),
(3, 21, 30, TRUE, NULL),
(1, 22, 50, TRUE, NULL),
(2, 22, 50, TRUE, NULL),
(3, 22, 50, TRUE, NULL);

-- Collegamento prodotti-allergeni
INSERT INTO product_allergens (product_id, allergen_id)
VALUES
(4, 1),
(6, 1),
(6, 11),
(7, 2),
(8, 2),
(9, 3),
(11, 7),
(12, 6),
(14, 1),
(14, 2),
(15, 2),
(15, 3),
(18, 1),
(18, 3),
(18, 2),
(19, 5),
(19, 6);

-- Ricette mock
INSERT INTO recipes (
    id,
    name,
    recipe_type,
    description,
    servings,
    image_url
)
VALUES
(1, 'Pasta al pomodoro', 'primo', 'Un primo semplice con spaghetti e condimento al pomodoro.', 2, ''),
(2, 'Risotto con piselli', 'primo', 'Risotto leggero preparato con riso Carnaroli e piselli.', 2, ''),
(3, 'Pollo con piselli', 'secondo', 'Secondo piatto semplice con petto di pollo e contorno di piselli.', 2, ''),
(4, 'Salmone al forno', 'secondo', 'Filetti di salmone da cuocere al forno con un contorno semplice.', 2, ''),
(5, 'Burger vegetale con insalata', 'secondo', 'Piatto vegetariano e vegano con burger vegetale e insalata mista.', 2, ''),
(6, 'Insalata con pane integrale', 'contorno', 'Contorno veloce con insalata mista e pane integrale.', 2, ''),
(7, 'Yogurt con banana', 'dolce', 'Dolce semplice con yogurt bianco e banana a fette.', 2, ''),
(8, 'Gelato con cioccolato fondente', 'dolce', 'Dessert veloce con gelato alla vaniglia e cioccolato fondente.', 2, '');

SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));

-- Ingredienti delle ricette mock
INSERT INTO recipe_ingredients (
    recipe_id,
    product_id,
    quantity,
    unit,
    is_optional
)
VALUES
-- Pasta al pomodoro
(1, 4, 250, 'g', FALSE),

-- Risotto con piselli
(2, 5, 180, 'g', FALSE),
(2, 13, 150, 'g', FALSE),

-- Pollo con piselli
(3, 10, 300, 'g', FALSE),
(3, 13, 150, 'g', FALSE),

-- Salmone al forno
(4, 11, 300, 'g', FALSE),

-- Burger vegetale con insalata
(5, 12, 2, 'pezzi', FALSE),
(5, 3, 1, 'busta', FALSE),

-- Insalata con pane integrale
(6, 3, 1, 'busta', FALSE),
(6, 6, 100, 'g', TRUE),

-- Yogurt con banana
(7, 8, 2, 'vasetti', FALSE),
(7, 2, 2, 'pezzi', FALSE),

-- Gelato con cioccolato fondente
(8, 15, 250, 'g', FALSE),
(8, 19, 50, 'g', TRUE);

SELECT setval('recipe_ingredients_id_seq', (SELECT MAX(id) FROM recipe_ingredients));

-- Slot di ritiro demo
-- Usiamo CURRENT_DATE e CURRENT_DATE + 1 per mantenere il seed riutilizzabile.
INSERT INTO pickup_slots (
    supermarket_id,
    slot_date,
    start_time,
    end_time,
    max_orders,
    current_orders,
    is_active
)
VALUES
-- Fresh2Go Market Centro - oggi
(1, CURRENT_DATE, '09:00', '10:00', 10, 2, TRUE),
(1, CURRENT_DATE, '10:00', '11:00', 10, 10, TRUE),
(1, CURRENT_DATE, '16:00', '17:00', 10, 4, TRUE),
(1, CURRENT_DATE, '17:00', '18:00', 10, 0, FALSE),

-- Fresh2Go Market Centro - domani
(1, CURRENT_DATE + 1, '09:00', '10:00', 10, 1, TRUE),
(1, CURRENT_DATE + 1, '10:00', '11:00', 10, 3, TRUE),
(1, CURRENT_DATE + 1, '16:00', '17:00', 10, 0, TRUE),
(1, CURRENT_DATE + 1, '17:00', '18:00', 10, 8, TRUE),

-- Fresh2Go Express Nord - oggi
(2, CURRENT_DATE, '09:00', '10:00', 8, 1, TRUE),
(2, CURRENT_DATE, '10:00', '11:00', 8, 8, TRUE),
(2, CURRENT_DATE, '16:00', '17:00', 8, 2, TRUE),
(2, CURRENT_DATE, '17:00', '18:00', 8, 0, TRUE),

-- Fresh2Go Express Nord - domani
(2, CURRENT_DATE + 1, '09:00', '10:00', 8, 0, TRUE),
(2, CURRENT_DATE + 1, '10:00', '11:00', 8, 4, TRUE),
(2, CURRENT_DATE + 1, '16:00', '17:00', 8, 8, TRUE),
(2, CURRENT_DATE + 1, '17:00', '18:00', 8, 1, TRUE),

-- Fresh2Go Bio Sud - oggi
(3, CURRENT_DATE, '09:00', '10:00', 6, 0, TRUE),
(3, CURRENT_DATE, '10:00', '11:00', 6, 6, TRUE),
(3, CURRENT_DATE, '16:00', '17:00', 6, 2, TRUE),
(3, CURRENT_DATE, '17:00', '18:00', 6, 0, FALSE),

-- Fresh2Go Bio Sud - domani
(3, CURRENT_DATE + 1, '09:00', '10:00', 6, 1, TRUE),
(3, CURRENT_DATE + 1, '10:00', '11:00', 6, 0, TRUE),
(3, CURRENT_DATE + 1, '16:00', '17:00', 6, 5, TRUE),
(3, CURRENT_DATE + 1, '17:00', '18:00', 6, 6, TRUE);

SELECT setval('pickup_slots_id_seq', (SELECT MAX(id) FROM pickup_slots));