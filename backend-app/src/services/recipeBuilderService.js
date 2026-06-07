const { calculateNutrition } = require("./nutritionService");
const { recipeMatchesDietary } = require("./recipeQueryService");

// Turns ingredient IDs into readable names when metadata is missing
function formatIngredientId(ingredientId) {
  return String(ingredientId || "")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Creates a fast ingredientId -> ingredient metadata lookup
function buildIngredientLookup(ingredients) {
  return new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
}

// Finds which supported dietary labels apply to the full recipe
function getRecipeDietaryLabels(recipe, ingredientLookup) {
  const supportedDiets = ["vegetarian", "vegan", "gluten-free"];

  return supportedDiets.filter((dietary) =>
    recipeMatchesDietary(recipe, ingredientLookup, dietary),
  );
}

// Combines recipe ingredient amounts with ingredient metadata for display
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

// Builds the full recipe detail response used by the recipe detail page
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

// Builds a smaller recipe response used by the recipe list page
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
