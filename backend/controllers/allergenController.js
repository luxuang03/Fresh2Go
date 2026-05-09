const pool = require('../db')

async function getAllergens(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        label,
        description
      FROM allergens
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllergens,
}