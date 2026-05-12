const pool = require('../db')

function createError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function createOrder(req, res, next) {
  const client = await pool.connect()
  let transactionStarted = false

  try {
    const userId = req.session.user.id

    const {
      supermarketId,
      pickupSlotId,
      customerName,
      customerEmail,
      items,
    } = req.body

    if (!supermarketId || !pickupSlotId || !customerName || !customerEmail) {
      throw createError('Dati ordine mancanti', 400)
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw createError('Il carrello è vuoto', 400)
    }

    let totalPrice = 0

    for (const item of items) {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)

      if (!item.productId || !item.productName || quantity <= 0 || unitPrice < 0) {
        throw createError('Prodotto non valido nel carrello', 400)
      }

      totalPrice += quantity * unitPrice
    }

    await client.query('BEGIN')
    transactionStarted = true

    const slotResult = await client.query(
      `
      SELECT
        id,
        supermarket_id,
        max_orders,
        current_orders,
        is_active
      FROM pickup_slots
      WHERE id = $1
      `,
      [pickupSlotId],
    )

    if (slotResult.rows.length === 0) {
      throw createError('Slot di ritiro non trovato', 404)
    }

    const slot = slotResult.rows[0]

    if (Number(slot.supermarket_id) !== Number(supermarketId)) {
      throw createError(
        'Lo slot scelto non appartiene al supermercato selezionato',
        400,
      )
    }

    if (!slot.is_active || slot.current_orders >= slot.max_orders) {
      throw createError('Slot di ritiro non disponibile', 400)
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
      RETURNING
        id,
        user_id AS "userId",
        supermarket_id AS "supermarketId",
        pickup_slot_id AS "pickupSlotId",
        customer_name AS "customerName",
        customer_email AS "customerEmail",
        total_price AS "totalPrice",
        status,
        created_at AS "createdAt"
      `,
      [
        userId,
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
    if (transactionStarted) {
      await client.query('ROLLBACK')
    }

    next(error)
  } finally {
    client.release()
  }
}

async function getMyOrders(req, res, next) {
  try {
    const userId = req.session.user.id

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.customer_name AS "customerName",
        o.customer_email AS "customerEmail",
        o.total_price AS "totalPrice",
        o.status,
        o.created_at AS "createdAt",
        s.name AS "supermarketName",
        ps.slot_date AS "pickupDate",
        ps.start_time AS "startTime",
        ps.end_time AS "endTime"
      FROM orders o
      LEFT JOIN supermarkets s
        ON o.supermarket_id = s.id
      LEFT JOIN pickup_slots ps
        ON o.pickup_slot_id = ps.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userId],
    )

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
}

async function getOrderById(req, res, next) {
  try {
    const userId = req.session.user.id
    const orderId = req.params.id

    const orderResult = await pool.query(
      `
      SELECT
        o.id,
        o.user_id AS "userId",
        o.customer_name AS "customerName",
        o.customer_email AS "customerEmail",
        o.total_price AS "totalPrice",
        o.status,
        o.created_at AS "createdAt",
        s.name AS "supermarketName",
        ps.slot_date AS "pickupDate",
        ps.start_time AS "startTime",
        ps.end_time AS "endTime"
      FROM orders o
      LEFT JOIN supermarkets s
        ON o.supermarket_id = s.id
      LEFT JOIN pickup_slots ps
        ON o.pickup_slot_id = ps.id
      WHERE o.id = $1 AND o.user_id = $2
      `,
      [orderId, userId],
    )

    if (orderResult.rows.length === 0) {
      throw createError('Ordine non trovato', 404)
    }

    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id AS "productId",
        product_name AS "productName",
        quantity,
        unit_price AS "unitPrice",
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
    next(error)
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
}