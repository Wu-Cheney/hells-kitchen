import Link from "next/link";
import type { RecipeListItem } from "@/types/recipe";

type RecipeCardProps = {
  recipe: RecipeListItem;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-card-header">
        <div>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
        </div>

        <span className={`difficulty difficulty-${recipe.difficulty}`}>
          {recipe.difficulty}
        </span>
      </div>

      <div className="recipe-meta">
        <span>Prep: {recipe.prepTime}</span>
        <span>Cook: {recipe.cookTime}</span>
        <span>Serves: {recipe.servings}</span>
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
        <span>{recipe.nutrition.perServing.protein}g protein</span>
      </div>

      <Link href={`/recipes/${recipe.id}`} className="recipe-link">
        View recipe
      </Link>
    </article>
  );
}
