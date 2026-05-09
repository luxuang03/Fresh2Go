const express = require('express')
const router = express.Router()

const { getAllergens } = require('../controllers/allergenController')

router.get('/', getAllergens)

module.exports = router