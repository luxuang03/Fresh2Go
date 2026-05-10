const pool = require('../db')

async function getPickupSlots(req, res, next) {
  try {
    const { supermarketId, date } = req.query

    if (!supermarketId) {
      return res.status(400).json({
        message: 'supermarketId è obbligatorio',
      })
    }

    const values = [supermarketId]
    const conditions = ['ps.supermarket_id = $1']

    if (date) {
      values.push(date)
      conditions.push(`ps.slot_date = $${values.length}`)
    }

    const query = `
      SELECT
        ps.id,
        ps.supermarket_id,
        s.name AS supermarket_name,
        ps.slot_date,
        ps.start_time,
        ps.end_time,
        ps.max_orders,
        ps.current_orders,
        ps.is_active,
        CASE
          WHEN ps.is_active = FALSE THEN FALSE
          WHEN ps.current_orders >= ps.max_orders THEN FALSE
          ELSE TRUE
        END AS is_available
      FROM pickup_slots ps
      JOIN supermarkets s
        ON ps.supermarket_id = s.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ps.slot_date, ps.start_time
    `

    const result = await pool.query(query, values)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPickupSlots,
}