const express = require('express')
const router = express.Router()

const {
  getSupermarkets,
  getSupermarketById,
} = require('../controllers/supermarketController')

router.get('/', getSupermarkets)
router.get('/:id', getSupermarketById)

module.exports = router