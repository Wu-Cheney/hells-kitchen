const { queryRecipes } = require("../recipeQueryService");

function buildIngredientLookup(ingredients) {
  return new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
}

const recipes = [
  {
    id: "1",
    title: "Vegan Bowl",
    prepTime: "10 minutes",
    cookTime: "20 minutes",
    difficulty: "easy",
    tags: ["lunch", "healthy"],
    dateAdded: "2024-03-20T11:30:00Z",
    ingredients: [
      { ingredientId: "quinoa", amount: "1", unit: "cup" },
      { ingredientId: "chickpeas", amount: "1", unit: "can" },
    ],
  },
  {
    id: "2",
    title: "Chicken Dinner",
    prepTime: "25 minutes",
    cookTime: "15 minutes",
    difficulty: "medium",
    tags: ["dinner"],
    dateAdded: "2024-02-15T18:20:00Z",
    ingredients: [
      { ingredientId: "chicken", amount: "1", unit: "lb" },
      { ingredientId: "garlic", amount: "2", unit: "cloves" },
    ],
  },
  {
    id: "3",
    title: "Salad",
    prepTime: "5 minutes",
    cookTime: "0 minutes",
    difficulty: "hard",
    tags: ["salad"],
    dateAdded: "2024-04-01T12:00:00Z",
    ingredients: [{ ingredientId: "unknown_item", amount: "1", unit: "cup" }],
  },
];

const ingredientLookup = buildIngredientLookup([
  {
    id: "quinoa",
    name: "Quinoa",
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "chickpeas",
    name: "Chickpeas",
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "chicken",
    name: "Chicken Breast",
    dietary: ["high-protein"],
  },
  {
    id: "garlic",
    name: "Fresh Garlic",
    dietary: ["vegan", "gluten-free"],
  },
]);

describe("queryRecipes", () => {
  test("filters by recipe title search", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      search: "chicken",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["2"]);
  });

  test("filters by exact tag", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      tag: "lunch",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["1"]);
  });

  test("filters by ingredient id or display name", () => {
    const byId = queryRecipes(recipes, ingredientLookup, {
      ingredient: "garlic",
    });

    const byName = queryRecipes(recipes, ingredientLookup, {
      ingredient: "fresh garlic",
    });

    expect(byId.map((recipe) => recipe.id)).toEqual(["2"]);
    expect(byName.map((recipe) => recipe.id)).toEqual(["2"]);
  });

  test("treats vegan recipes as vegetarian", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      dietary: "vegetarian",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["1"]);
  });

  test("excludes recipes with missing ingredient metadata from dietary filters", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      dietary: "vegan",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["1"]);
  });

  test("sorts by total time ascending", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      sort: "totalTime",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["3", "1", "2"]);
  });

  test("sorts by difficulty easy to hard", () => {
    const result = queryRecipes(recipes, ingredientLookup, {
      sort: "difficulty",
    });

    expect(result.map((recipe) => recipe.id)).toEqual(["1", "2", "3"]);
  });
});
