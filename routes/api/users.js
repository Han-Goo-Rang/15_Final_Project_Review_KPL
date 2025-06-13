const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');

// Lindungi semua rute dengan token verifikasi
router.use(auth.authenticate);

// Get all users
router.get('/', userController.getAllUsers);

// Get single user
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;