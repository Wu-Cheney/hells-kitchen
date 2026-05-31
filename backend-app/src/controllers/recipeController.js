const recipeService = require("../services/recipeService");

async function getRecipes(req, res, next) {
  try {
    const filters = {
      search: req.query.search,
      tag: req.query.tag,
      ingredient: req.query.ingredient,
    };

    const recipes = await recipeService.getRecipes(filters);

    res.json({
      recipes,
      count: recipes.length,
    });
  } catch (error) {
    next(error);
  }
}

async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    return res.json({ recipe });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
};
