const express = require('express')
const router = express.Router()

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController')

router.post('/', createOrder)
router.get('/me', getMyOrders)
router.get('/:id', getOrderById)

module.exports = router