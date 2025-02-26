// /config/db.js

const { Sequelize } = require('sequelize');

// Database credentials
const sequelize = new Sequelize('postgres', 'postgres', 'sundar@12345', {
  host: 'localhost',           // PostgreSQL server
  dialect: 'postgres',         // Use PostgreSQL as the database dialect
  logging: false,              // Disable logging (optional)
});


// Export sequelize instance
module.exports = { sequelize };
