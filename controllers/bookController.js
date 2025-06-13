const Book = require('../models/book');

// Simulate a database
let books = [
  new Book(1, 'Hibernate Core ~11th', 'Educational', 'English', 'Available'),
  new Book(2, 'Hibernate Core ~11th', 'Educational', 'English', 'Borrowed')
];

// Penerapan Clean-Code: Parameterization / Generics
const createGetAll = (data) => (req, res) => res.json(data);
exports.getAllBooks = createGetAll(books);

// Get single book
exports.getBookById = (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

// Create new book
exports.createBook = (req, res) => {
  const { name, type, language, availability } = req.body;
  const newBook = new Book(
    books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    name,
    type,
    language,
    availability
  );
  books.push(newBook);
  res.status(201).json(newBook);
};

// Update book
exports.updateBook = (req, res) => {
  const bookId = parseInt(req.params.id);
  const { name, type, language, availability } = req.body;
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  books[bookIndex] = { ...books[bookIndex], name, type, language, availability };
  res.json(books[bookIndex]);
};

// Delete book
exports.deleteBook = (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully' });
};