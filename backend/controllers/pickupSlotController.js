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
        ps.supermarket_id AS "supermarketId",
        s.name AS "supermarketName",
        ps.slot_date AS "slotDate",
        ps.start_time AS "startTime",
        ps.end_time AS "endTime",
        ps.max_orders AS "maxOrders",
        ps.current_orders AS "currentOrders",
        ps.is_active AS "isActive",
        CASE
          WHEN ps.is_active = FALSE THEN FALSE
          WHEN ps.current_orders >= ps.max_orders THEN FALSE
          ELSE TRUE
        END AS "isAvailable"
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