const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  contactNo: String,
  email: String,
  username: String,
  password: String
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;