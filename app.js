const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('./middleware/auth');

// Protected routes
router.get('/', auth.authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

router.get('/users', auth.authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/user-management.html'));
});

router.get('/books', auth.authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/book-management.html'));
});

router.get('/branches', auth.authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/branch-management.html'));
});


module.exports = router;