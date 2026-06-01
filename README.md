# Recipe Manager - Full Stack Take-Home Exercise

## Overview

Create a recipe management application that allows users to view, search, and organize recipes. This exercise tests your ability to build a full-stack web application with a focus on data relationships and user experience.

## Tips

- Use whatever frameworks/tools you're most comfortable with
- Focus on creating a working MVP before adding advanced features
- Be sure to document any assumptions or known limitations
- Test your application with different scenarios

## Setup Instructions

#### Backend setup

```
cd backend-app
npm install
npm run dev # Starts express server on port 8080
```

#### Frontend setup

```
cd frontend-app
npm install
npm run dev # Starts nextjs frontend server on port 3000
```

#### Database setup

```
The application uses a JSON file (`data.json`) as a mock database
```

**Note: Feel free to use whatever frontend or backend framework you want. The sample contains a Next.js + Express server scaffold, but use whatever you're comfortable with.**

## Requirements

#### Core Features (Required)

- Display a list of recipes with their basic information (`/recipes`)
- Implement recipe detail page (`/recipes/:id`) showing:
  - Ingredients with quantities
  - Cooking instructions
  - Tags
  - Nutritional information (calculated from ingredients)
- Add search/filter functionality on (`/recipes`) by:
  - Recipe name
  - Tags
  - Ingredients

#### Example Advanced Features (Bonus Points. Feel free to implement any of these or add your own. Some examples below)

- Implement dietary restriction filters (e.g., vegetarian, vegan, gluten-free)
- Create a calorie calculator based on serving size
- Add recipe scaling functionality (e.g., adjust ingredients for different serving sizes)
- Implement recipe favoriting/saving
- Add sorting options (prep time, difficulty, etc.)
- Add a "shopping list" generator for selected recipes
- Incorporate an LLM feature
- Types

## Evaluation Criteria

- Code organization and clarity
- UI/UX design and responsiveness
- API design and implementation
- Error handling and edge cases
- Performance considerations
- TypeScript/JavaScript best practices

## Submission

1. Update this README with a new section below called `Candidate Notes:
   - Setup instructions if you've added any requirements
   - Brief explanation of your implementation choices
   - List of completed features
   - Any assumptions made
   - Known limitations or bugs
   - Additional features you'd add with more time

2. Send us (via email to scott.nguyen@sprx.tax & anthony.difalco@sprx.tax):
   - A zip file of the entire project (frontend and backend)
   - A link to a deployed version of the application (bonus points)

Good luck! We're excited to see your implementation.

## Candidate Notes:

### Setup Instructions

No additional setup is needed beyond the provided frontend/backend install steps to run the app locally.

Backend tests:

```bash
cd backend-app
npm test
```

### High Level Implementation Choices

- Focused on making the backend structure simple. Split responsibilities between routes, controllers, repository access, query logic, response building, and nutrition calculation. The goal was to keep each part responsible for one main thing.
- Added a repository layer around `data.json` so the rest of the backend does not depend directly on the mock storage format. If this later moved to a real database, most of the controller/service logic could stay the same.
- Kept controllers thin. They read request/query params, return JSON responses, and forward errors. Filtering, sorting, ingredient lookup, and nutrition logic live in the service layer.
- Filtering and sorting are handled through backend query params on `/api/recipes`, so the API owns recipe query behavior and the frontend can stay focused on rendering.
- The backend builds recipe response objects with ingredient metadata already resolved, so the frontend does not need to understand the raw recipe/ingredient relationship.
- On the frontend, search and filters use URL query params with a standard GET form. This keeps filtered results refreshable/shareable and avoids making the whole page a client component.
- I kept the visual design simple and focused mostly on clarity, scannability, and intuitive interactions. I added basic responsive layouts, clickable cards, grouped detail sections, and collapsed filters, but did not spend too much time on visual polish since I prioritized core functionality and code structure. For a real end product, I would spend more time refining the UI.
- I added focused backend unit tests for the service layer because that is where most of the business logic lives, especially nutrition assumptions, missing data handling, filtering, and sorting.

### Completed Features

Core features:

- Recipe list page at `/recipes`
  - Search by recipe name
  - Filter/search by tag and ingredient
- Recipe detail page at `/recipes/:id`
  - Ingredients with quantities
  - Cooking instructions, tags, and nutrition summary

Bonus/additional features:

- Dietary filters for vegetarian, vegan, and gluten-free
- Difficulty filter
- Sorting by newest, total time, and difficulty
- Recipe scaling with 1x, 2x, and 3x multipliers
- Recipe-level dietary labels
- Collapsible advanced filters
- Total time formatting, such as `90 min -> 1 hr 30 min`
- Missing ingredient metadata handling with UI warnings
- Fully clickable recipe cards with hover/focus styling
- Deployed frontend/backend demo
- Backend unit tests for nutrition calculation and recipe query behavior

### Assumptions Made

- Ingredient nutrition values are assumed to be based on 100g.
- Recipe units are converted to approximate grams before nutrition is calculated. For example, I use `1 cup = 250g` as a rough estimate, even though the real weight would depend on the ingredient.
- If a unit is unsupported, that ingredient is excluded from the nutrition total instead of using a misleading fallback value.
- Some recipe ingredient IDs do not have matching entries in the ingredient list. I chose not to modify the provided mock data because real apps often need to handle incomplete data gracefully. For a recipe app, I think it is reasonable to still show the recipe with a clear warning. For more critical data, like financial or payment data, I would lean toward failing fast or blocking the calculation instead of showing a potentially incomplete result.
  - The app still displays the ingredient using a readable name inferred from the ingredient ID.
  - Missing metadata is marked in the UI.
  - Missing or unsupported ingredients are excluded from nutrition totals.
  - The UI warns users when nutrition may be incomplete.
- Vegan recipes are treated as vegetarian for filtering, but vegetarian recipes are not treated as vegan.
- For dietary filters, recipes with missing ingredient metadata are excluded because the app cannot safely verify the restriction.
- I limited dietary filters to vegetarian, vegan, and gluten-free. Labels like keto and high-protein are more nutrition-goal oriented and would be better calculated from macros.

### Limitations

- Recipe scaling multiplies ingredient amounts and serving count, but does not rewrite units, such as converting `16 tbsp` to `1 cup`.
- The JSON file is read from disk per request. That is fine for a mock database, but in production I would use a real database and likely add caching where appropriate.
- Filtering and sorting are done in memory because the app uses a JSON mock database. With a real database, I would move a lot of that into database queries.
- The app does not include authentication or user-specific persistence.

### Additional Features I Would Add With More Time

- Add favorites/saved recipes. I did not prioritize this because it becomes more meaningful with user accounts or persistent storage, while filtering/sorting better fit the current data-focused scope.
- Replace the JSON file with a real database and move filtering/sorting into database queries.
- Add a more robust ingredient-specific unit conversion system.
- More comprehensive unit and integration tests
- Add a shopping list generator that combines ingredients across selected recipes.
- Add an AI feature for ingredient substitutions or recipe suggestions.
- Add Tailwind or some component library because pretty pages make me happy :)
