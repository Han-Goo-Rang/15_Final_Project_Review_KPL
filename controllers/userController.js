const User = require('../models/user');

// Simulate a database
let users = [
  new User(1, 'Prabath Jayasuriya', 'prabathjaylk@gmail.com', 'prabathjay'),
  new User(2, 'Prabath Jayasuriya', 'prabathjaylk@gmail.com', 'prabathjay')
];

// Get all users
exports.getAllUsers = (req, res) => {
  res.json(users);
};

// Get single user
exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Create new user
exports.createUser = (req, res) => {
  const { name, email, username } = req.body;
  const newUser = new User(
    users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    username
  );
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update user
exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, username } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  users[userIndex] = { ...users[userIndex], name, email, username };
  res.json(users[userIndex]);
};

// Delete user
exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
};