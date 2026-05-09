function getProducts(req, res) {
  res.json({
    message: 'Lista prodotti da implementare',
  })
}

function getProductById(req, res) {
  res.json({
    message: 'Dettaglio prodotto da implementare',
    productId: req.params.id,
  })
}

module.exports = {
  getProducts,
  getProductById,
}