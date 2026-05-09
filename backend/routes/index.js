const express = require('express')
const router = express.Router()

const productRoutes = require('./productRoutes')
const categoryRoutes = require('./categoryRoutes')
const allergenRoutes = require('./allergenRoutes')
const supermarketRoutes = require('./supermarketRoutes')
const recipeRoutes = require('./recipeRoutes')
const orderRoutes = require('./orderRoutes')

router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/allergens', allergenRoutes)
router.use('/supermarkets', supermarketRoutes)
router.use('/recipes', recipeRoutes)
router.use('/orders', orderRoutes)

module.exports = router