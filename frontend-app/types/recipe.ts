export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionSummary = {
  total: Nutrition;
  perServing: Nutrition;
  isComplete: boolean;
  missingIngredientIds: string[];
};

export type RecipeIngredientDetail = {
  ingredientId: string;
  amount: string;
  unit: string;
  name: string;
  category: string;
  nutrition: Nutrition | null;
  commonAllergens: string[];
  dietary: string[];
  isMissingMetadata: boolean;
};

export type RecipeListItem = {
  id: string;
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  dateAdded: string;
  ingredientNames: string[];
  nutrition: NutritionSummary;
};

export type RecipeDetail = Omit<RecipeListItem, "ingredientNames"> & {
  ingredients: RecipeIngredientDetail[];
  instructions: string[];
};

export type RecipesResponse = {
  recipes: RecipeListItem[];
  count: number;
};

export type RecipeDetailResponse = {
  recipe: RecipeDetail;
};
