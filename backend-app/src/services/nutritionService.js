const { parseAmount } = require("../utils/parseAmount");
const { convertToGrams } = require("../utils/convertToGrams");

function createEmptyNutrition() {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
}

function roundNutrition(nutrition) {
  return {
    calories: Math.round(nutrition.calories),
    protein: Number(nutrition.protein.toFixed(1)),
    carbs: Number(nutrition.carbs.toFixed(1)),
    fat: Number(nutrition.fat.toFixed(1)),
  };
}

function addNutrition(currNutrition, ingredientNutrition, multiplier) {
  currNutrition.calories += ingredientNutrition.calories * multiplier;
  currNutrition.protein += ingredientNutrition.protein * multiplier;
  currNutrition.carbs += ingredientNutrition.carbs * multiplier;
  currNutrition.fat += ingredientNutrition.fat * multiplier;
}

function calculateNutrition(recipeIngredients, ingredientLookup, servings) {
  const missingIngredientIds = [];

  const totalNutrition = recipeIngredients.reduce(
    (currNutrition, recipeIngredient) => {
      const ingredient = ingredientLookup.get(recipeIngredient.ingredientId);

      if (!ingredient) {
        missingIngredientIds.push(recipeIngredient.ingredientId);
        return currNutrition;
      }

      const amount = parseAmount(recipeIngredient.amount);
      const grams = convertToGrams(amount, recipeIngredient.unit);

      // Assumption: ingredient nutrition values are per 100g.
      const multiplier = grams / 100;

      addNutrition(currNutrition, ingredient.nutrition, multiplier);

      return currNutrition;
    },
    createEmptyNutrition(),
  );

  const safeServings = servings > 0 ? servings : 1;

  const perServingNutrition = {
    calories: totalNutrition.calories / safeServings,
    protein: totalNutrition.protein / safeServings,
    carbs: totalNutrition.carbs / safeServings,
    fat: totalNutrition.fat / safeServings,
  };

  return {
    total: roundNutrition(totalNutrition),
    perServing: roundNutrition(perServingNutrition),
    isComplete: missingIngredientIds.length === 0,
    missingIngredientIds,
  };
}

module.exports = {
  calculateNutrition,
};
