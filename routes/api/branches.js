const express = require('express');
const router = express.Router();
const branchController = require('../../controllers/branchController');
const auth = require('../../middleware/auth');

// Lindungi semua rute dengan token verifikasi
router.use(auth.authenticate);

// Get all branches
router.get('/', branchController.getAllBranches);

// Get single branch
router.get('/:id', branchController.getBranchById);

// Create new branch
router.post('/', branchController.createBranch);

// Update branch
router.put('/:id', branchController.updateBranch);

// Delete branch
router.delete('/:id', branchController.deleteBranch);

module.exports = router;