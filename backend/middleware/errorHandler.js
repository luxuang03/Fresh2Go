function errorHandler(error, req, res, next) {
  console.error(error)

  res.status(500).json({
    message: 'Errore interno del server',
  })
}

module.exports = errorHandler