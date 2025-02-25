const { getRecipesByIngredients, searchRecipes } = require('../services/spoonacularService');

const generateRecipe = async (req, res) => {
  const { ingredients, query } = req.body;  // Expecting ingredients or query in the body

  if (!ingredients && !query) {
    return res.status(400).json({ message: 'Please provide either ingredients or a query.' });
  }

  try {
    let recipes = [];

    // If ingredients are provided, fetch recipes based on ingredients
    if (ingredients && ingredients.length > 0) {
      recipes = await getRecipesByIngredients(ingredients);
    }
    
    // If a query is provided, search for recipes based on the query
    if (query) {
      recipes = await searchRecipes(query);
    }

    // If no recipes are found, send a not found response
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found.' });
    }

    // Return the fetched recipes
    res.status(200).json({
      message: 'Recipes fetched successfully!',
      recipes: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recipes, please try again later.' });
  }
};

module.exports = { generateRecipe };
