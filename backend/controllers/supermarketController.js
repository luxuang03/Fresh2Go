const pool = require('../db')

async function getSupermarkets(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        address,
        city,
        opening_time,
        closing_time,
        is_active
      FROM supermarkets
      WHERE is_active = TRUE
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

async function getSupermarketById(req, res, next) {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        address,
        city,
        latitude,
        longitude,
        opening_time,
        closing_time,
        is_active
      FROM supermarkets
      WHERE id = $1
      `,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Supermercato non trovato',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSupermarkets,
  getSupermarketById,
}