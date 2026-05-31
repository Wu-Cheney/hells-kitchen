import type { RecipeIngredientDetail } from "@/types/recipe";

type IngredientListProps = {
  ingredients: RecipeIngredientDetail[];
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <section className="detail-section">
      <h2>Ingredients</h2>

      <ul className="ingredient-list">
        {ingredients.map((ingredient) => (
          <li key={`${ingredient.ingredientId}-${ingredient.amount}`}>
            <div>
              <span className="ingredient-name">{ingredient.name}</span>
              <p>
                {ingredient.amount} {ingredient.unit}
              </p>

              {ingredient.isMissingMetadata && (
                <p className="warning-text">
                  * Ingredient details not found. Nutrition and labels may be
                  incomplete.
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
