const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/bookController');
const auth = require('../../middleware/auth');

// Lindungi semua rute dengan token verifikasi
router.use(auth.authenticate);

// Get all books
router.get('/', bookController.getAllBooks);

// Get single book by ID
router.get('/:id', bookController.getBookById);

// Create new book bypass using expressjs body parser
router.post('/', bookController.createBook);

// Update book for table books
router.put('/:id', bookController.updateBook);

// Delete book
router.delete('/:id', bookController.deleteBook);

module.exports = router;