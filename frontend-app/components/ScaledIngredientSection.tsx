"use client";

import { useState } from "react";
import RecipeScalingControls from "@/components/RecipeScalingControls";
import type { RecipeIngredientDetail } from "@/types/recipe";
import { getScaledAmount } from "@/lib/formatters";

type ScaledIngredientSectionProps = {
  ingredients: RecipeIngredientDetail[];
  servings: number;
};

export default function ScaledIngredientSection({
  ingredients,
  servings,
}: ScaledIngredientSectionProps) {
  const [scale, setScale] = useState(1);

  const scaledIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    amount: getScaledAmount(ingredient.amount, scale),
  }));

  return (
    <section className="detail-section">
      <div className="section-header">
        <div>
          <h2>Ingredients</h2>
          <p className="section-note">Serves {servings * scale}</p>
        </div>

        <RecipeScalingControls selectedScale={scale} onScaleChange={setScale} />
      </div>

      <ul className="ingredient-list">
        {scaledIngredients.map((ingredient) => (
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
