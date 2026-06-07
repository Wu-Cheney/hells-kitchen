const { parseAmount } = require("../utils/parseAmount");
const { convertToGrams } = require("../utils/convertToGrams");

// Creates a fresh nutrition accumulator for each calculation
function createEmptyNutrition() {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
}

// Rounds nutrition values before returning them to the API response
function roundNutrition(nutrition) {
  return {
    calories: Math.round(nutrition.calories),
    protein: Number(nutrition.protein.toFixed(1)),
    carbs: Number(nutrition.carbs.toFixed(1)),
    fat: Number(nutrition.fat.toFixed(1)),
  };
}

// Adds one ingredient's nutrition into the running recipe total
function addNutrition(currNutrition, ingredientNutrition, multiplier) {
  currNutrition.calories += ingredientNutrition.calories * multiplier;
  currNutrition.protein += ingredientNutrition.protein * multiplier;
  currNutrition.carbs += ingredientNutrition.carbs * multiplier;
  currNutrition.fat += ingredientNutrition.fat * multiplier;
}

// Calculates total and per-serving nutrition for a recipe
function calculateNutrition(recipeIngredients, ingredientLookup, servings) {
  const missingIngredientIds = new Set();

  const totalNutrition = recipeIngredients.reduce(
    (currNutrition, recipeIngredient) => {
      const ingredient = ingredientLookup.get(recipeIngredient.ingredientId);

      if (!ingredient) {
        missingIngredientIds.add(recipeIngredient.ingredientId);
        return currNutrition;
      }

      const amount = parseAmount(recipeIngredient.amount);
      const grams = convertToGrams(amount, recipeIngredient.unit);

      if (grams === null) {
        missingIngredientIds.add(recipeIngredient.ingredientId);
        return currNutrition;
      }

      // Assumption: ingredient nutrition values are per 100g
      const multiplier = grams / 100;

      addNutrition(currNutrition, ingredient.nutrition, multiplier);

      return currNutrition;
    },
    createEmptyNutrition(),
  );

  const safeServings = servings > 0 ? servings : 1;
  const missingIds = Array.from(missingIngredientIds);

  const perServingNutrition = {
    calories: totalNutrition.calories / safeServings,
    protein: totalNutrition.protein / safeServings,
    carbs: totalNutrition.carbs / safeServings,
    fat: totalNutrition.fat / safeServings,
  };

  return {
    total: roundNutrition(totalNutrition),
    perServing: roundNutrition(perServingNutrition),
    isComplete: missingIds.length === 0,
    missingIngredientIds: missingIds,
  };
}

module.exports = {
  calculateNutrition,
};
