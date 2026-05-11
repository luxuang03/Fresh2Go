const bcrypt = require('bcrypt')
const pool = require('../db')

function createError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function register(req, res, next) {
  try {
    const { username, email, password, fullName, phone } = req.body

    if (!username || !email || !password) {
      throw createError('Username, email e password sono obbligatori', 400)
    }

    if (password.length < 6) {
      throw createError('La password deve avere almeno 6 caratteri', 400)
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE username = $1 OR email = $2
      `,
      [username, email],
    )

    if (existingUser.rows.length > 0) {
      throw createError('Username o email già utilizzati', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO users (
        username,
        email,
        password_hash,
        full_name,
        phone
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, full_name, phone, created_at
      `,
      [username, email, passwordHash, fullName || null, phone || null],
    )

    res.status(201).json({
      message: 'Utente registrato correttamente',
      user: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
}