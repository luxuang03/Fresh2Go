const express = require('express')
const router = express.Router()

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController')

const { requireAuth } = require('../middleware/authMiddleware')

router.post('/', requireAuth, createOrder)
router.get('/me', requireAuth, getMyOrders)
router.get('/:id', requireAuth, getOrderById)

module.exports = router