import RecipeCard from "@/components/RecipeCard";
import { getRecipes } from "@/lib/api";
import "@/styles/recipes.css";

type RecipesPageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    ingredient?: string;
    dietary?: string;
    difficulty?: string;
    sort?: string;
  }>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const filters = await searchParams;
  const { recipes, count } = await getRecipes(filters);

  return (
    <main className="recipes-page">
      <section className="recipes-hero">
        <div>
          <p className="eyebrow">Recipe Manager</p>
          <h1>Explore recipes</h1>
          <p>
            Browse recipes, view nutrition, and filter by tags, ingredients, and
            dietary needs.
          </p>
        </div>

        <div className="recipe-count">
          <span>{count}</span>
          <p>{count === 1 ? "recipe" : "recipes"}</p>
        </div>
      </section>

      <form className="recipe-search-form">
        <div className="search-row">
          <label className="search-field">
            Recipe name
            <input
              name="search"
              type="search"
              placeholder="Search by recipe name"
              defaultValue={filters.search || ""}
            />
          </label>

          <button type="submit">Search</button>

          <a href="/recipes" className="clear-filters-link">
            Clear
          </a>
        </div>

        <details
          className="advanced-filters"
          open={Boolean(
            filters.search ||
            filters.tag ||
            filters.ingredient ||
            filters.dietary ||
            filters.difficulty ||
            filters.sort,
          )}
        >
          <summary>Filters</summary>

          <div className="filter-grid">
            <label>
              Tag
              <input
                name="tag"
                type="search"
                placeholder="e.g. dinner, pasta"
                defaultValue={filters.tag || ""}
              />
            </label>

            <label>
              Ingredient
              <input
                name="ingredient"
                type="search"
                placeholder="e.g. garlic, chicken"
                defaultValue={filters.ingredient || ""}
              />
            </label>

            <label>
              Dietary
              <select name="dietary" defaultValue={filters.dietary || ""}>
                <option value="">Any</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
              </select>
            </label>

            <label>
              Difficulty
              <select name="difficulty" defaultValue={filters.difficulty || ""}>
                <option value="">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label>
              Sort by
              <select name="sort" defaultValue={filters.sort || ""}>
                <option value="">Default</option>
                <option value="newest">Newest</option>
                <option value="totalTime">Total time</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </label>
          </div>
        </details>
      </form>

      {recipes.length === 0 ? (
        <section className="empty-state">
          <h2>No recipes found</h2>
          <p>Try changing your search or clearing filters.</p>
        </section>
      ) : (
        <section className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}
