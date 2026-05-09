const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time')

    res.json({
      status: 'ok',
      databaseTime: result.rows[0].current_time,
    })
  } catch (error) {
    console.error('Errore connessione database:', error)

    res.status(500).json({
      status: 'error',
      message: 'Errore nella connessione al database',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`)
})