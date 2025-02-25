// /models/User.js
const {  DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

    const User = sequelize.define('User', {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Ensures that the name is required
      },
      email: {
        type: DataTypes.STRING,
        unique: true, // Ensures that the email is unique
        allowNull: false, // Ensures that the email is required
        validate: {
          isEmail: true, // Validates if the value is a valid email format
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // Ensures that the password is required
        validate: {
          len: [8, 128], // Optionally, you can add password length validation
        },
      },

      profile_photo: {
        type: DataTypes.STRING, // This will store the file path/filename
        allowNull: true, // Photo is optional
      },
      // You can add more fields like role, createdAt, updatedAt, etc. as needed
    });
  
    // Hook to run before a new user is created, for example, hashing the password
    User.beforeCreate((user, options) => {
      // You can hash the password here using bcrypt or any other package
      // user.password = hashPassword(user.password);
    });
  
module.exports = User;