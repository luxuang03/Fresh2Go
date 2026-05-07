-- Fresh2Go - Schema database
-- Tabelle iniziali:
-- users, supermarkets, categories, products, allergens

DROP TABLE IF EXISTS product_allergens;
DROP TABLE IF EXISTS supermarket_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS allergens;
DROP TABLE IF EXISTS supermarkets;
DROP TABLE IF EXISTS users;

-- Tabella users
-- Salva gli utenti registrati al sito
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    full_name VARCHAR(120),
    phone VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella supermarkets
-- Salva i supermercati disponibili su Fresh2Go
CREATE TABLE supermarkets (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,

    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    opening_time TIME,
    closing_time TIME,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella categories
-- Salva le categorie dei prodotti
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,

    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella products
-- Salva i prodotti del catalogo generale
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,

    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,

    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100),
    description TEXT,
    ingredients TEXT,

    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),

    discount_percentage NUMERIC(5,2) DEFAULT 0
        CHECK (discount_percentage >= 0 AND discount_percentage <= 100),

    image_url TEXT,
    unit_label VARCHAR(30),

    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        is_vegan = FALSE
        OR is_vegetarian = TRUE
    )
);

-- Tabella supermarket_products
-- Collega prodotti e supermercati
-- Gestisce disponibilità e stock per ogni punto vendita
CREATE TABLE supermarket_products (
    supermarket_id BIGINT REFERENCES supermarkets(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,

    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    is_available BOOLEAN DEFAULT TRUE,

    local_price NUMERIC(10,2) CHECK (local_price >= 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (supermarket_id, product_id)
);

-- Tabella allergens
-- Salva gli allergeni standard
CREATE TABLE allergens (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(80) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella product_allergens
-- Collega prodotti e allergeni
CREATE TABLE product_allergens (
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,

    PRIMARY KEY (product_id, allergen_id)
);