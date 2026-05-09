function createOrder(req, res) {
  res.json({
    message: 'Creazione ordine da implementare',
  })
}

function getMyOrders(req, res) {
  res.json({
    message: 'Storico ordini utente da implementare',
  })
}

function getOrderById(req, res) {
  res.json({
    message: 'Dettaglio ordine da implementare',
    orderId: req.params.id,
  })
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
}