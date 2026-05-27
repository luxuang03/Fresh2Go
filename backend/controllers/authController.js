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

    if (!username || !email || !password || !fullName) {
      throw createError('Username, email e password sono obbligatori', 400)
    }

    if (password.length < 6 || password.length > 128) {
      throw createError('La password deve essere compresa tra 6 e 128 caratteri', 400)
    }

    if (username.length > 30) {
      throw createError('Lo username non può superare i 30 caratteri', 400)
    }

    if (email.length > 120) {
      throw createError("L'email non può superare i 120 caratteri", 400)
    }

    if (fullName.length > 80) {
      throw createError('Il nome completo non può superare i 80 caratteri', 400)
    }

    if (phone && phone.length > 20) {
      throw createError('Il numero di telefono non può superare i 20 caratteri', 400)
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
      RETURNING
        id,
        username,
        email,
        full_name AS "fullName",
        phone,
        created_at AS "createdAt"
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

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw createError('Email e password sono obbligatorie', 400)
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        password_hash,
        full_name,
        phone
      FROM users
      WHERE email = $1
      `,
      [email],
    )

    if (result.rows.length === 0) {
      throw createError('Credenziali non valide', 401)
    }

    const user = result.rows[0]

    const passwordIsValid = await bcrypt.compare(password, user.password_hash)

    if (!passwordIsValid) {
      throw createError('Credenziali non valide', 401)
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
    }

    res.json({
      message: 'Login effettuato correttamente',
      user: req.session.user,
    })
  } catch (error) {
    next(error)
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      next(error)
      return
    }

    res.clearCookie('connect.sid')

    res.json({
      message: 'Logout effettuato correttamente',
    })
  })
}

async function me(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: 'Utente non autenticato',
        user: null,
      })
    }

    res.json({
      user: req.session.user,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
}