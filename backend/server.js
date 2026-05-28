const express = require('express')
const cors = require('cors')
const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)
const path = require('path')
require('dotenv').config()

const pool = require('./db')
const apiRoutes = require('./routes')
const notFoundHandler = require('./middleware/notFoundHandler')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000
const frontendPath = path.join(__dirname, '../frontend/dist')

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json())

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  }),
)

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

app.use('/api', apiRoutes)

app.use(express.static(frontendPath))

app.use((req, res, next) => {
  if (req.method === 'GET') {
    return res.sendFile(path.join(frontendPath, 'index.html'))
  }

  next()
})

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`)
})