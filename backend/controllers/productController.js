const pool = require('../db')

async function getProducts(req, res, next) {
  try {
    const {
      supermarketId,
      categoryId,
      search,
      minPrice,
      maxPrice,
      onlyDiscounted,
      onlyAvailable,
      excludeAllergens,
      vegetarian,
      vegan,
    } = req.query

    const values = []
    const conditions = []

    let query = `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.description,
        p.ingredients,
        COALESCE(sp.local_price, p.price) AS price,
        p.price AS "originalPrice",
        sp.local_price AS "localPrice",
        p.discount_percentage AS "discountPercentage",
        p.image_url AS "imageUrl",
        p.unit_label AS "unitLabel",
        p.is_vegetarian AS "isVegetarian",
        p.is_vegan AS "isVegan",
        c.id AS "categoryId",
        c.name AS "categoryName",
        sp.supermarket_id AS "supermarketId",
        sp.stock_quantity AS "stockQuantity",
        sp.is_available AS "isAvailable"
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN supermarket_products sp
        ON p.id = sp.product_id
    `

    if (supermarketId) {
      values.push(supermarketId)
      conditions.push(`sp.supermarket_id = $${values.length}`)
    }

    if (categoryId) {
      values.push(categoryId)
      conditions.push(`p.category_id = $${values.length}`)
    }

    if (search) {
      values.push(`%${search}%`)
      conditions.push(`
        (
          p.name ILIKE $${values.length}
          OR p.brand ILIKE $${values.length}
          OR p.description ILIKE $${values.length}
          OR p.ingredients ILIKE $${values.length}
        )
      `)
    }

    if (minPrice) {
      values.push(minPrice)
      conditions.push(`COALESCE(sp.local_price, p.price) >= $${values.length}`)
    }

    if (maxPrice) {
      values.push(maxPrice)
      conditions.push(`COALESCE(sp.local_price, p.price) <= $${values.length}`)
    }

    if (onlyDiscounted === 'true') {
      conditions.push(`p.discount_percentage > 0`)
    }

    if (onlyAvailable === 'true') {
      conditions.push(`sp.is_available = TRUE`)
      conditions.push(`sp.stock_quantity > 0`)
    }

    if (excludeAllergens) {
      const allergens = excludeAllergens
        .split(',')
        .map((allergen) => allergen.trim().toLowerCase())
        .filter((allergen) => allergen !== '')

      if (allergens.length > 0) {
        values.push(allergens)

        conditions.push(`
          NOT EXISTS (
            SELECT 1
            FROM product_allergens pa
            INNER JOIN allergens a
              ON pa.allergen_id = a.id
            WHERE pa.product_id = p.id
              AND LOWER(a.name) = ANY($${values.length})
          )
        `)
      }
    }

    if (vegetarian === 'true') {
      conditions.push(`p.is_vegetarian = TRUE`)
    }

    if (vegan === 'true') {
      conditions.push(`p.is_vegan = TRUE`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ` ORDER BY p.id, sp.supermarket_id`

    const result = await pool.query(query, values)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params
    const { supermarketId } = req.query

    const values = [id]

    let productQuery = `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.description,
        p.ingredients,
        COALESCE(sp.local_price, p.price) AS price,
        p.price AS "originalPrice",
        sp.local_price AS "localPrice",
        p.discount_percentage AS "discountPercentage",
        p.image_url AS "imageUrl",
        p.unit_label AS "unitLabel",
        p.is_vegetarian AS "isVegetarian",
        p.is_vegan AS "isVegan",
        c.id AS "categoryId",
        c.name AS "categoryName",
        sp.supermarket_id AS "supermarketId",
        sp.stock_quantity AS "stockQuantity",
        sp.is_available AS "isAvailable"
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN supermarket_products sp
        ON p.id = sp.product_id
      WHERE p.id = $1
    `

    if (supermarketId) {
      values.push(supermarketId)
      productQuery += ` AND sp.supermarket_id = $2`
    }

    productQuery += ` ORDER BY sp.supermarket_id LIMIT 1`

    const productResult = await pool.query(productQuery, values)

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Prodotto non trovato',
      })
    }

    const allergenResult = await pool.query(
      `
        SELECT
          a.id,
          a.name,
          a.label,
          a.description
        FROM allergens a
        INNER JOIN product_allergens pa
          ON a.id = pa.allergen_id
        WHERE pa.product_id = $1
        ORDER BY a.id
      `,
      [id],
    )

    const product = productResult.rows[0]

    product.allergens = allergenResult.rows

    res.json(product)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProductById,
}