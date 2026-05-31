import type { NutritionSummary } from "@/types/recipe";

type RecipeNutritionProps = {
  nutrition: NutritionSummary;
};

export default function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  return (
    <section className="detail-section">
      <h2>Nutrition</h2>

      <div className="nutrition-grid">
        <NutritionCard label="Calories" value={nutrition.perServing.calories} />
        <NutritionCard
          label="Protein"
          value={`${nutrition.perServing.protein}g`}
        />
        <NutritionCard label="Carbs" value={`${nutrition.perServing.carbs}g`} />
        <NutritionCard label="Fat" value={`${nutrition.perServing.fat}g`} />
      </div>

      <p className="section-note">Approximate nutrition per serving.</p>

      {!nutrition.isComplete && (
        <p className="warning-text">
          Nutrition may be incomplete because some ingredients are missing
          nutrition data.
        </p>
      )}
    </section>
  );
}

type NutritionCardProps = {
  label: string;
  value: string | number;
};

function NutritionCard({ label, value }: NutritionCardProps) {
  return (
    <div className="nutrition-card">
      <span>{value}</span>
      <p>{label}</p>
    </div>
  );
}
