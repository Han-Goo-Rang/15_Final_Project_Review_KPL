// routes/api/employees.js
const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');
const auth = require('../../middleware/auth');

router.get('/', auth.authenticate, employeeController.getAllEmployees);
router.get('/:id', auth.authenticate, employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', auth.authenticate, employeeController.updateEmployee);
router.delete('/:id', auth.authenticate, employeeController.deleteEmployee);

module.exports = router;