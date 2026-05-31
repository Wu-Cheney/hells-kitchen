import Link from "next/link";
import { notFound } from "next/navigation";
import ScaledIngredientSection from "@/components/ScaledIngredientSection";
import RecipeNutrition from "@/components/RecipeNutrition";
import { ApiError, getRecipeById } from "@/lib/api";
import { getTotalTime } from "@/lib/formatters";
import "@/styles/recipes.css";

type RecipeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;

  try {
    const { recipe } = await getRecipeById(id);

    return (
      <main className="recipes-page">
        <Link href="/recipes" className="back-link">
          ← Back to recipes
        </Link>

        <section className="recipe-detail-header">
          <div>
            <div className="recipe-tags">
              {recipe.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}

              {recipe.dietaryLabels.map((label) => (
                <span key={label} className="dietary-tag">
                  {label}
                </span>
              ))}
            </div>

            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>

            <div className="recipe-meta">
              <span>Prep: {recipe.prepTime}</span>
              <span>Cook: {recipe.cookTime}</span>
              <span>
                Total time: {getTotalTime(recipe.prepTime, recipe.cookTime)}
              </span>
              <span className={`difficulty difficulty-${recipe.difficulty}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </section>

        <div className="recipe-detail-layout">
          <div className="recipe-detail-main">
            <ScaledIngredientSection
              ingredients={recipe.ingredients}
              servings={recipe.servings}
            />

            <section className="detail-section">
              <h2>Instructions</h2>

              <ol className="instruction-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={`${instruction}-${index}`}>{instruction}</li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="recipe-detail-sidebar">
            <RecipeNutrition nutrition={recipe.nutrition} />
          </aside>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
