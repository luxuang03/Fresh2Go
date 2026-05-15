const pool = require('../db')

async function getRecipes(req, res, next) {
  try {
    const { supermarketId, type, search } = req.query

    const values = []
    const conditions = []

    if (supermarketId) {
      values.push(supermarketId)
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM recipe_ingredients ri_check
          INNER JOIN supermarket_products sp_check
            ON ri_check.product_id = sp_check.product_id
          WHERE ri_check.recipe_id = r.id
            AND sp_check.supermarket_id = $${values.length}
            AND sp_check.is_available = TRUE
            AND sp_check.stock_quantity > 0
        )
      `)
    }

    if (type) {
      values.push(type)
      conditions.push(`r.recipe_type = $${values.length}`)
    }

    if (search) {
      values.push(`%${search}%`)
      conditions.push(`r.name ILIKE $${values.length}`)
    }

    let query = `
      SELECT
        r.id,
        r.name,
        r.recipe_type AS type,
        r.description,
        r.servings,
        r.image_url AS "imageUrl",
        COUNT(DISTINCT ri.id) AS "ingredientsCount",
        COALESCE(
          ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL),
          '{}'
        ) AS allergens
      FROM recipes r
      LEFT JOIN recipe_ingredients ri
        ON r.id = ri.recipe_id
      LEFT JOIN product_allergens pa
        ON ri.product_id = pa.product_id
      LEFT JOIN allergens a
        ON pa.allergen_id = a.id
    `

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += `
      GROUP BY r.id
      ORDER BY r.id
    `

    const result = await pool.query(query, values)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params
    const { supermarketId } = req.query

    const recipeResult = await pool.query(
      `
      SELECT
        id,
        name,
        recipe_type AS type,
        description,
        servings,
        image_url AS "imageUrl"
      FROM recipes
      WHERE id = $1
      `,
      [id],
    )

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Ricetta non trovata',
      })
    }

    const values = [id]

    let ingredientsQuery = `
      SELECT
        ri.id,
        ri.product_id AS "productId",
        p.name AS "productName",
        p.brand,
        COALESCE(sp.local_price, p.price) AS price,
        p.discount_percentage AS "discountPercentage",
        p.image_url AS "imageUrl",
        p.unit_label AS "unitLabel",
        ri.quantity,
        ri.unit,
        ri.is_optional AS "isOptional",
        sp.stock_quantity AS "stockQuantity",
        sp.is_available AS "isAvailable"
      FROM recipe_ingredients ri
      JOIN products p
        ON ri.product_id = p.id
      LEFT JOIN supermarket_products sp
        ON ri.product_id = sp.product_id
    `

    if (supermarketId) {
      values.push(supermarketId)

      ingredientsQuery += `
        AND sp.supermarket_id = $2
      `
    }

    ingredientsQuery += `
      WHERE ri.recipe_id = $1
      ORDER BY ri.id
    `

    const ingredientsResult = await pool.query(ingredientsQuery, values)

    const allergensResult = await pool.query(
      `
      SELECT DISTINCT
        a.name
      FROM recipe_ingredients ri
      INNER JOIN product_allergens pa
        ON ri.product_id = pa.product_id
      INNER JOIN allergens a
        ON pa.allergen_id = a.id
      WHERE ri.recipe_id = $1
      ORDER BY a.name
      `,
      [id],
    )

    const recipe = recipeResult.rows[0]

    recipe.ingredients = ingredientsResult.rows
    recipe.allergens = allergensResult.rows.map((row) => row.name)

    res.json(recipe)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
}