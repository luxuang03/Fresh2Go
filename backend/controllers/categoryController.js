const pool = require('../db')

async function getCategories(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        parent_id
      FROM categories
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
}