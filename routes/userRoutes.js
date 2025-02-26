// /routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser,editUser ,getAllUsers,getUserById,deleteUser} = require('../controllers/userController');
const upload = require('../config/multerConfig'); // Import Multer config


// Route to register a user
router.post('/register', registerUser);
router.get('/get-all-users', getAllUsers);
router.get('/fetch-profile/:id', getUserById);
// Route to login a user
router.post('/login', loginUser);

// Protected rout
// 
// e

router.delete('/delete-user/:id',deleteUser)
router.put('/edit/:id', upload.single('profile_photo'), editUser); // 'profile_photo' is the field name in the form


module.exports = router;
