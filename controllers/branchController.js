const Branch = require('../models/branch');

// Simulate a database
let branches = [
  new Branch(1, 'Dilibrary Matara', '0412410984', 'Matara'),
  new Branch(2, 'Dilibrary Matara', '0412410984', 'Matara')
];

// Get all branches
exports.getAllBranches = (req, res) => {
  res.json(branches);
};

// Get single branch
exports.getBranchById = (req, res) => {
  const branchId = parseInt(req.params.id);
  const branch = branches.find(b => b.id === branchId);
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  res.json(branch);
};

// Create new branch
exports.createBranch = (req, res) => {
  const { name, contactNo, location } = req.body;
  const newBranch = new Branch(
    branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1,
    name,
    contactNo,
    location
  );
  branches.push(newBranch);
  res.status(201).json(newBranch);
};

// Update branch
exports.updateBranch = (req, res) => {
  const branchId = parseInt(req.params.id);
  const { name, contactNo, location } = req.body;
  const branchIndex = branches.findIndex(b => b.id === branchId);
  if (branchIndex === -1) return res.status(404).json({ message: 'Branch not found' });
  branches[branchIndex] = { ...branches[branchIndex], name, contactNo, location };
  res.json(branches[branchIndex]);
};

// Delete branch
exports.deleteBranch = (req, res) => {
  const branchId = parseInt(req.params.id);
  const branchIndex = branches.findIndex(b => b.id === branchId);
  if (branchIndex === -1) return res.status(404).json({ message: 'Branch not found' });
  branches.splice(branchIndex, 1);
  res.json({ message: 'Branch deleted successfully' });
};