const { calculateNutrition } = require("./nutritionService");
const { recipeMatchesDietary } = require("./recipeQueryService");

function formatIngredientId(ingredientId) {
  return String(ingredientId || "")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildIngredientLookup(ingredients) {
  return new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
}

function getRecipeDietaryLabels(recipe, ingredientLookup) {
  const supportedDiets = ["vegetarian", "vegan", "gluten-free"];

  return supportedDiets.filter((dietary) =>
    recipeMatchesDietary(recipe, ingredientLookup, dietary),
  );
}

function resolveRecipeIngredients(recipeIngredients, ingredientLookup) {
  return recipeIngredients.map((recipeIngredient) => {
    const ingredient = ingredientLookup.get(recipeIngredient.ingredientId);

    if (!ingredient) {
      return {
        ...recipeIngredient,
        name: formatIngredientId(recipeIngredient.ingredientId),
        category: "unknown",
        nutrition: null,
        commonAllergens: [],
        dietary: [],
        isMissingMetadata: true,
      };
    }

    return {
      ...recipeIngredient,
      name: ingredient.name,
      category: ingredient.category,
      nutrition: ingredient.nutrition,
      commonAllergens: ingredient.commonAllergens,
      dietary: ingredient.dietary,
      isMissingMetadata: false,
    };
  });
}

function buildRecipeDetail(recipe, ingredientLookup) {
  const resolvedIngredients = resolveRecipeIngredients(
    recipe.ingredients,
    ingredientLookup,
  );

  const nutrition = calculateNutrition(
    recipe.ingredients,
    ingredientLookup,
    recipe.servings,
  );

  const dietaryLabels = getRecipeDietaryLabels(recipe, ingredientLookup);

  return {
    ...recipe,
    ingredients: resolvedIngredients,
    nutrition,
    dietaryLabels,
  };
}

function buildRecipeListItem(recipe, ingredientLookup) {
  const detail = buildRecipeDetail(recipe, ingredientLookup);

  return {
    id: detail.id,
    title: detail.title,
    description: detail.description,
    servings: detail.servings,
    prepTime: detail.prepTime,
    cookTime: detail.cookTime,
    difficulty: detail.difficulty,
    tags: detail.tags,
    dateAdded: detail.dateAdded,
    ingredientNames: detail.ingredients.map((ingredient) => ingredient.name),
    nutrition: detail.nutrition,
    dietaryLabels: detail.dietaryLabels,
  };
}

module.exports = {
  buildIngredientLookup,
  buildRecipeDetail,
  buildRecipeListItem,
};
