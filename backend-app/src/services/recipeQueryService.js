const DIFFICULTY_RANKS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function ingredientMatchesDietary(ingredient, dietary) {
  const normalizedDietary = normalizeText(dietary);
  const dietaryLabels = ingredient.dietary.map(normalizeText);

  if (normalizedDietary === "vegetarian") {
    return (
      dietaryLabels.includes("vegetarian") || dietaryLabels.includes("vegan")
    );
  }

  return dietaryLabels.includes(normalizedDietary);
}

function recipeMatchesDietary(recipe, ingredientLookup, dietary) {
  if (!dietary) {
    return true;
  }

  return recipe.ingredients.every((recipeIngredient) => {
    const ingredient = ingredientLookup.get(recipeIngredient.ingredientId);

    if (!ingredient) {
      return false;
    }

    return ingredientMatchesDietary(ingredient, dietary);
  });
}

function recipeMatchesDifficulty(recipe, difficulty) {
  if (!difficulty) {
    return true;
  }

  return normalizeText(recipe.difficulty) === normalizeText(difficulty);
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

function filterRecipes(recipes, ingredientLookup, filters = {}) {
  return recipes.filter((recipe) => {
    return (
      recipeMatchesSearch(recipe, filters.search) &&
      recipeMatchesTag(recipe, filters.tag) &&
      recipeMatchesIngredient(recipe, ingredientLookup, filters.ingredient) &&
      recipeMatchesDietary(recipe, ingredientLookup, filters.dietary) &&
      recipeMatchesDifficulty(recipe, filters.difficulty)
    );
  });
}

function parseMinutes(time) {
  const match = String(time || "").match(/\d+/);

  if (!match) {
    return 0;
  }

  return Number(match[0]);
}

function getTotalRecipeMinutes(recipe) {
  return parseMinutes(recipe.prepTime) + parseMinutes(recipe.cookTime);
}

function getDifficultyRank(difficulty) {
  return DIFFICULTY_RANKS[normalizeText(difficulty)] || 99;
}

function sortRecipes(recipes, sort) {
  if (!sort) {
    return recipes;
  }

  const sortedRecipes = [...recipes];

  switch (sort) {
    case "newest":
      return sortedRecipes.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
      );

    case "totalTime":
      return sortedRecipes.sort(
        (a, b) => getTotalRecipeMinutes(a) - getTotalRecipeMinutes(b),
      );

    case "difficulty":
      return sortedRecipes.sort(
        (a, b) =>
          getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty),
      );

    default:
      return recipes;
  }
}

function queryRecipes(recipes, ingredientLookup, filters = {}) {
  const filteredRecipes = filterRecipes(recipes, ingredientLookup, filters);
  return sortRecipes(filteredRecipes, filters.sort);
}

module.exports = {
  queryRecipes,
  recipeMatchesDietary,
};
