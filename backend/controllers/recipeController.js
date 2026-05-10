const pool = require('../db')

async function getRecipes(req, res, next) {
  try {
    const { type, search } = req.query

    const values = []
    const conditions = []

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
        r.recipe_type,
        r.description,
        r.servings,
        r.image_url,
        COUNT(ri.id) AS ingredients_count
      FROM recipes r
      LEFT JOIN recipe_ingredients ri
        ON r.id = ri.recipe_id
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

    const recipeResult = await pool.query(
      `
      SELECT
        id,
        name,
        recipe_type,
        description,
        servings,
        image_url
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

    const ingredientsResult = await pool.query(
      `
      SELECT
        ri.id,
        ri.product_id,
        p.name AS product_name,
        p.brand,
        p.price,
        p.discount_percentage,
        p.unit_label,
        ri.quantity,
        ri.unit,
        ri.is_optional
      FROM recipe_ingredients ri
      JOIN products p
        ON ri.product_id = p.id
      WHERE ri.recipe_id = $1
      ORDER BY ri.id
      `,
      [id],
    )

    const recipe = recipeResult.rows[0]

    recipe.ingredients = ingredientsResult.rows

    res.json(recipe)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
}