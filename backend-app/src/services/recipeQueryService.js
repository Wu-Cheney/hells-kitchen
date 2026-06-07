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

// Checks if a single ingredient matches a dietary restriction.
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

// Checks if every ingredient in a recipe satisfies a dietary restriction.
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

// Checks if a recipe matches the selected difficulty.
function recipeMatchesDifficulty(recipe, difficulty) {
  if (!difficulty) {
    return true;
  }

  return normalizeText(recipe.difficulty) === normalizeText(difficulty);
}

// Checks if the recipe title matches the search text.
function recipeMatchesSearch(recipe, search) {
  if (!search) {
    return true;
  }

  return normalizeText(recipe.title).includes(normalizeText(search));
}

// Checks if the recipe has the selected tag.
function recipeMatchesTag(recipe, tag) {
  if (!tag) {
    return true;
  }

  return recipe.tags.some(
    (recipeTag) => normalizeText(recipeTag) === normalizeText(tag),
  );
}

// Checks if the recipe contains an ingredient matching the search text.
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

// Applies all active filters to the recipe list.
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

// Parses minute values from strings
function parseMinutes(time) {
  const match = String(time || "").match(/\d+/);

  if (!match) {
    return 0;
  }

  return Number(match[0]);
}

// Calculates total recipe time from prep and cook time
function getTotalRecipeMinutes(recipe) {
  return parseMinutes(recipe.prepTime) + parseMinutes(recipe.cookTime);
}

// Converts difficulty labels into sortable numeric values
function getDifficultyRank(difficulty) {
  return DIFFICULTY_RANKS[normalizeText(difficulty)] || 99;
}

// Sorts recipes by the selected sort option
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

// Filters first, then sorts the remaining recipes
function queryRecipes(recipes, ingredientLookup, filters = {}) {
  const filteredRecipes = filterRecipes(recipes, ingredientLookup, filters);
  return sortRecipes(filteredRecipes, filters.sort);
}

module.exports = {
  queryRecipes,
  recipeMatchesDietary,
};
