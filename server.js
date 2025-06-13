require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const connectDB = require('./db');
const auth = require('./middleware/auth');
const cors = require('cors');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect DB
connectDB();

// API routes (all protected via token inside route files if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', require('./routes/api/books'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/employees', require('./routes/api/employees'));
app.use('/api/branches', require('./routes/api/branches'));
app.use('/api/auth', require('./routes/api/auth'));


// Public pages (auth views)
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/auth/login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public/auth/signup.html')));
app.get('/logout', (req, res) => res.redirect('/login'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
