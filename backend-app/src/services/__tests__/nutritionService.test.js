const { calculateNutrition } = require("../nutritionService");

function buildIngredientLookup(ingredients) {
  return new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
}

const tomato = {
  id: "tomato",
  nutrition: {
    calories: 25,
    protein: 1,
    carbs: 5,
    fat: 0,
  },
};

const oliveOil = {
  id: "olive_oil",
  nutrition: {
    calories: 120,
    protein: 0,
    carbs: 0,
    fat: 14,
  },
};

describe("calculateNutrition", () => {
  test("calculates total and per-serving nutrition using gram conversion", () => {
    const recipeIngredients = [
      { ingredientId: "tomato", amount: "200", unit: "g" },
      { ingredientId: "olive_oil", amount: "1", unit: "tbsp" },
    ];

    const ingredientLookup = buildIngredientLookup([tomato, oliveOil]);

    const result = calculateNutrition(recipeIngredients, ingredientLookup, 2);

    expect(result.total.calories).toBe(68);
    expect(result.perServing.calories).toBe(34);
    expect(result.isComplete).toBe(true);
    expect(result.missingIngredientIds).toEqual([]);
  });

  test("marks nutrition incomplete when ingredient metadata is missing", () => {
    const recipeIngredients = [
      { ingredientId: "tomato", amount: "100", unit: "g" },
      { ingredientId: "missing_ingredient", amount: "1", unit: "cup" },
    ];

    const ingredientLookup = buildIngredientLookup([tomato]);

    const result = calculateNutrition(recipeIngredients, ingredientLookup, 1);

    expect(result.total.calories).toBe(25);
    expect(result.isComplete).toBe(false);
    expect(result.missingIngredientIds).toEqual(["missing_ingredient"]);
  });

  test("marks nutrition incomplete when an ingredient has an unsupported unit", () => {
    const recipeIngredients = [
      { ingredientId: "tomato", amount: "1", unit: "unknown_unit" },
    ];

    const ingredientLookup = buildIngredientLookup([tomato]);

    const result = calculateNutrition(recipeIngredients, ingredientLookup, 1);

    expect(result.total.calories).toBe(0);
    expect(result.isComplete).toBe(false);
    expect(result.missingIngredientIds).toEqual(["tomato"]);
  });
});
