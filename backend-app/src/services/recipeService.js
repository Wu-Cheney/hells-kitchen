const recipeRepository = require("../repositories/recipeRepository");
const { queryRecipes } = require("./recipeQueryService");
const {
  buildIngredientLookup,
  buildRecipeDetail,
  buildRecipeListItem,
} = require("./recipeBuilderService");

async function getRecipes(filters = {}) {
  const [recipes, ingredients] = await Promise.all([
    recipeRepository.getRecipes(),
    recipeRepository.getIngredients(),
  ]);

  const ingredientLookup = buildIngredientLookup(ingredients);
  const queriedRecipes = queryRecipes(recipes, ingredientLookup, filters);

  return queriedRecipes.map((recipe) =>
    buildRecipeListItem(recipe, ingredientLookup),
  );
}

async function getRecipeById(id) {
  const [recipe, ingredients] = await Promise.all([
    recipeRepository.getRecipeById(id),
    recipeRepository.getIngredients(),
  ]);

  if (!recipe) {
    return null;
  }

  const ingredientLookup = buildIngredientLookup(ingredients);

  return buildRecipeDetail(recipe, ingredientLookup);
}

module.exports = {
  getRecipes,
  getRecipeById,
};
