function getRecipes(req, res) {
  res.json({
    message: 'Lista ricette da implementare',
  })
}

function getRecipeById(req, res) {
  res.json({
    message: 'Dettaglio ricetta da implementare',
    recipeId: req.params.id,
  })
}

module.exports = {
  getRecipes,
  getRecipeById,
}