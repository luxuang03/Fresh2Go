function getSupermarkets(req, res) {
  res.json({
    message: 'Lista supermercati da implementare',
  })
}

function getSupermarketById(req, res) {
  res.json({
    message: 'Dettaglio supermercato da implementare',
    supermarketId: req.params.id,
  })
}

module.exports = {
  getSupermarkets,
  getSupermarketById,
}