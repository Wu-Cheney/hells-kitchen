import type { RecipeDetailResponse, RecipesResponse } from "@/types/recipe";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type RecipeFilters = {
  search?: string;
  tag?: string;
  ingredient?: string;
  dietary?: string;
  difficulty?: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function buildQueryString(filters: RecipeFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export async function getRecipes(
  filters: RecipeFilters = {},
): Promise<RecipesResponse> {
  const queryString = buildQueryString(filters);

  return fetchJson<RecipesResponse>(
    `${API_BASE_URL}/api/recipes${queryString}`,
  );
}

export async function getRecipeById(id: string): Promise<RecipeDetailResponse> {
  return fetchJson<RecipeDetailResponse>(`${API_BASE_URL}/api/recipes/${id}`);
}
