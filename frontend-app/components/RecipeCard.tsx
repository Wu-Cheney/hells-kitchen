import Link from "next/link";
import type { RecipeListItem } from "@/types/recipe";
import { getTotalTime } from "@/lib/formatters";

type RecipeCardProps = {
  recipe: RecipeListItem;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="recipe-card">
      <article>
        <div className="recipe-card-header">
          <div>
            <h2>{recipe.title}</h2>
          </div>

          <span className={`difficulty difficulty-${recipe.difficulty}`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="recipe-meta">
          <span>
            Total time: {getTotalTime(recipe.prepTime, recipe.cookTime)}
          </span>
        </div>

        <div className="recipe-tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="recipe-nutrition-preview">
          <span>{recipe.nutrition.perServing.calories} cal / serving</span>
        </div>
      </article>
    </Link>
  );
}
