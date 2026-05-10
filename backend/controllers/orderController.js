const pool = require('../db')

async function createOrder(req, res) {
  const client = await pool.connect()

  try {
    const {
      userId,
      supermarketId,
      pickupSlotId,
      customerName,
      customerEmail,
      items,
    } = req.body

    if (!supermarketId || !pickupSlotId || !customerName || !customerEmail) {
      return res.status(400).json({
        message: 'Dati ordine mancanti',
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Il carrello è vuoto',
      })
    }

    let totalPrice = 0

    for (const item of items) {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)

      if (!item.productId || !item.productName || quantity <= 0 || unitPrice < 0) {
        return res.status(400).json({
          message: 'Prodotto non valido nel carrello',
        })
      }

      totalPrice += quantity * unitPrice
    }

    await client.query('BEGIN')

    const slotResult = await client.query(
      `
      SELECT id, supermarket_id, max_orders, current_orders, is_active
      FROM pickup_slots
      WHERE id = $1
      `,
      [pickupSlotId],
    )

    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        message: 'Slot di ritiro non trovato',
      })
    }

    const slot = slotResult.rows[0]

    if (Number(slot.supermarket_id) !== Number(supermarketId)) {
      await client.query('ROLLBACK')

      return res.status(400).json({
        message: 'Lo slot scelto non appartiene al supermercato selezionato',
      })
    }

    if (!slot.is_active || slot.current_orders >= slot.max_orders) {
      await client.query('ROLLBACK')

      return res.status(400).json({
        message: 'Slot di ritiro non disponibile',
      })
    }

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        supermarket_id,
        pickup_slot_id,
        customer_name,
        customer_email,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
      RETURNING *
      `,
      [
        userId || null,
        supermarketId,
        pickupSlotId,
        customerName,
        customerEmail,
        totalPrice,
      ],
    )

    const order = orderResult.rows[0]

    for (const item of items) {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)
      const subtotal = quantity * unitPrice

      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          unit_price,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.productName,
          quantity,
          unitPrice,
          subtotal,
        ],
      )
    }

    await client.query(
      `
      UPDATE pickup_slots
      SET current_orders = current_orders + 1
      WHERE id = $1
      `,
      [pickupSlotId],
    )

    await client.query('COMMIT')

    res.status(201).json({
      message: 'Ordine creato correttamente',
      order,
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Errore creazione ordine:', error)

    res.status(500).json({
      message: 'Errore durante la creazione dell ordine',
    })
  } finally {
    client.release()
  }
}

async function getMyOrders(req, res) {
  try {
    const userId = req.query.userId

    if (!userId) {
      return res.status(400).json({
        message: 'userId mancante',
      })
    }

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.customer_name,
        o.customer_email,
        o.total_price,
        o.status,
        o.created_at,
        s.name AS supermarket_name,
        ps.slot_date,
        ps.start_time,
        ps.end_time
      FROM orders o
      LEFT JOIN supermarkets s ON o.supermarket_id = s.id
      LEFT JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userId],
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Errore recupero ordini:', error)

    res.status(500).json({
      message: 'Errore durante il recupero degli ordini',
    })
  }
}

async function getOrderById(req, res) {
  try {
    const orderId = req.params.id

    const orderResult = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.total_price,
        o.status,
        o.created_at,
        s.name AS supermarket_name,
        ps.slot_date,
        ps.start_time,
        ps.end_time
      FROM orders o
      LEFT JOIN supermarkets s ON o.supermarket_id = s.id
      LEFT JOIN pickup_slots ps ON o.pickup_slot_id = ps.id
      WHERE o.id = $1
      `,
      [orderId],
    )

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Ordine non trovato',
      })
    }

    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        product_name,
        quantity,
        unit_price,
        subtotal
      FROM order_items
      WHERE order_id = $1
      ORDER BY id
      `,
      [orderId],
    )

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    })
  } catch (error) {
    console.error('Errore recupero dettaglio ordine:', error)

    res.status(500).json({
      message: 'Errore durante il recupero del dettaglio ordine',
    })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
}