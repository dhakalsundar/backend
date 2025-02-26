// routes/recipeRoutes.js
const express = require('express');
const { generateRecipe } = require('../controllers/recipeController');

const router = express.Router();

// Define the POST endpoint to generate recipes
router.post('/generate-recipe', generateRecipe);

module.exports = router;
