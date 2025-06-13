// controllers/employeeController.js
const bcrypt = require('bcryptjs');
const Employee = require('../models/employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, contactNo, email, username, password } = req.body;

        const employeeExists = await Employee. findOne({ $or: [{ username }, { email }] });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = new Employee({
            firstName,
            lastName,
            contactNo,
            email,
            username,
            password: hashedPassword
        });

        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { firstName, lastName, contactNo, email, username, password } = req.body;

        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            employee.password = hashedPassword;
        }

        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.contactNo = contactNo || employee.contactNo;
        employee.email = email || employee.email;
        employee.username = username || employee.username;

        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};