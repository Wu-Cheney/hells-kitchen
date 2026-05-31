const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "../../db/data.json");

async function getData() {
  const fileContents = await fs.readFile(dataFilePath, "utf8");
  const data = JSON.parse(fileContents);

  if (!Array.isArray(data.recipes)) {
    throw new Error("Invalid data.json: expected recipes to be an array");
  }

  if (!Array.isArray(data.ingredients)) {
    throw new Error("Invalid data.json: expected ingredients to be an array");
  }

  return data;
}

async function getRecipes() {
  const data = await getData();
  return data.recipes;
}

async function getIngredients() {
  const data = await getData();
  return data.ingredients;
}

async function getRecipeById(id) {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.id === id) || null;
}

module.exports = {
  getData,
  getRecipes,
  getIngredients,
  getRecipeById,
};
