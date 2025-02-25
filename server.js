// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');
const contentRoutes = require('./routes/contentRoutes');
const newRecipeROutes= require("./routes/newRecipeRoutes")
// Initialize express app
const app = express();

// Middleware
app.use(cors()); // To handle cross-origin requests (if needed)
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use('/api/recipes', recipeRoutes);
app.use('/recipe',newRecipeROutes)
// Routes
app.use('/api/users', userRoutes); // Use user routes for user-related actions (e.g., login, register)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/content', contentRoutes);  // Use content routes for generation requests

// Sync sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database connected and models synced!');
  })
  .catch((error) => {
    console.error('Error connecting to the database: ', error);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js Express app with JWT authentication!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
