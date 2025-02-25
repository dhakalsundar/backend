// /controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const upload = require('../config/multerConfig'); // Import Multer config

// JWT Secret Key (store securely in env variable in production)
const JWT_SECRET = 'your_secret_key'; // Replace with an actual secret key

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_photo: null,
    });

    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profile_photo:newUser.profile_photo
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user, please try again later.' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists with the provided email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create a JWT token (expires in 1 hour for example)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Return the JWT token and user info
    res.status(200).json({
      message: 'Login successful!',
      token, // Send JWT token
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in, please try again later.' });
  }
};

// Protected Route Example (to verify JWT)
const protectedRoute = async (req, res) => {
  try {
    // The JWT token is passed in the Authorization header as "Bearer token"
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Optionally, you can get the user information from the database using the decoded token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the token is valid, send the protected data
    res.status(200).json({
      message: 'Protected data accessed!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_photo:null
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params; // User ID to delete
  
    try {
      const user = await User.findByPk(id); // Find user by ID
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Delete the user
      await user.destroy();
  
      res.status(200).json({
        message: 'User deleted successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting user, please try again later.' });
    }
  };
  

  // Get All Users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({
        message: 'Users retrieved successfully!',
        users: users, // Send list of users
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving users, please try again later.' });
    }
  };
  



// Edit User with Photo Upload
const editUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from params
    const { name, email } = req.body; // Get the name and email from request body
  
    try {
      // Check if the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Prepare an object to store the updated fields
      const updatedFields = {};
  
      // Only update the name if it's provided
      if (name) {
        updatedFields.name = name;
      }
  
      // Only update the email if it's provided
      if (email) {
        updatedFields.email = email;
      }
  
      // If a file is uploaded, store the file path in the database
      if (req.file) {
        // Update the file path to be the full URL
        updatedFields.profile_photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
  
      // If there are any fields to update, update the user
      if (Object.keys(updatedFields).length > 0) {
        await user.update(updatedFields);
      }
  
      res.status(200).json({
        message: 'User updated successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_photo: user.profile_photo,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user, please try again later.' });
    }
  };
  


  // Get User by ID
const getUserById = async (req, res) => {
    const { id } = req.params; // Get the user ID from params
  
    try {
      // Find the user by ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Return the user data
      res.status(200).json({
        message: 'User retrieved successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_photo: user.profile_photo,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving user, please try again later.' });
    }
  };
  
  module.exports = {
    registerUser,
    loginUser,
    editUser,
    getAllUsers,
    deleteUser,
    protectedRoute,
    getUserById, // Export getUserById
  };
  

