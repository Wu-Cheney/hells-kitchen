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
                  Ingredient details not found. Nutrition and labels may be
                  incomplete.
                </p>
              )}
            </div>

            <div className="ingredient-meta">
              {ingredient.isMissingMetadata ? (
                <span>missing metadata</span>
              ) : (
                <>
                  <span>{ingredient.category}</span>
                  {ingredient.dietary.slice(0, 2).map((diet) => (
                    <span key={diet}>{diet}</span>
                  ))}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
