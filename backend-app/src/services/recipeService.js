const recipeRepository = require("../repositories/recipeRepository");
const { calculateNutrition } = require("./nutritionService");

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

  return {
    ...recipe,
    ingredients: resolvedIngredients,
    nutrition,
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
  };
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function recipeMatchesSearch(recipe, search) {
  if (!search) {
    return true;
  }

  return normalizeText(recipe.title).includes(normalizeText(search));
}

function recipeMatchesTag(recipe, tag) {
  if (!tag) {
    return true;
  }

  return recipe.tags.some(
    (recipeTag) => normalizeText(recipeTag) === normalizeText(tag),
  );
}

function recipeMatchesIngredient(recipe, ingredientLookup, ingredientSearch) {
  if (!ingredientSearch) {
    return true;
  }

  const normalizedIngredientSearch = normalizeText(ingredientSearch);

  return recipe.ingredients.some((recipeIngredient) => {
    const ingredient = ingredientLookup.get(recipeIngredient.ingredientId);

    return (
      normalizeText(recipeIngredient.ingredientId).includes(
        normalizedIngredientSearch,
      ) || normalizeText(ingredient?.name).includes(normalizedIngredientSearch)
    );
  });
}

function applyRecipeFilters(recipes, ingredientLookup, filters) {
  return recipes.filter((recipe) => {
    return (
      recipeMatchesSearch(recipe, filters.search) &&
      recipeMatchesTag(recipe, filters.tag) &&
      recipeMatchesIngredient(recipe, ingredientLookup, filters.ingredient)
    );
  });
}

async function getRecipes(filters = {}) {
  const [recipes, ingredients] = await Promise.all([
    recipeRepository.getRecipes(),
    recipeRepository.getIngredients(),
  ]);

  const ingredientLookup = buildIngredientLookup(ingredients);
  const filteredRecipes = applyRecipeFilters(
    recipes,
    ingredientLookup,
    filters,
  );

  return filteredRecipes.map((recipe) =>
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
