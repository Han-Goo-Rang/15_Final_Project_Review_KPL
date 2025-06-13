// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

// Signup
exports.signup = async (req, res) => {
  try {
    // Penerapan Clean-Code: Table-Driven Construction
    const { firstName, lastName, contactNo, email, username, password } = req.body;

    const employeeExists = await Employee.findOne({ $or: [{ username }, { email }] });
    const errorTable = {
  'Employee already exists': { status: 400, message: 'Employee already exists' },
  'Invalid credentials': { status: 401, message: 'Invalid credentials' }
};

if (employeeExists) {
  return res.status(errorTable['Employee already exists'].status).json({ message: errorTable['Employee already exists'].message });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      firstName,
      lastName,
      contactNo,
      email,
      username,
      password: hashedPassword
    });

    await employee.save();

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful', token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
