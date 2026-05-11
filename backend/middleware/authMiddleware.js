function requireAuth(req, res, next) {
    if (!req.session.user) {
      const error = new Error('Utente non autenticato')
      error.statusCode = 401
      next(error)
      return
    }
  
    next()
  }
  
  module.exports = {
    requireAuth,
  }