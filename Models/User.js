// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tob: {
    type: DataTypes.STRING, // Time as string "HH:mm" or store as TIME in some dialects
    allowNull: true,
  },
  pob: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aadhar: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [12, 12], // Aadhaar is 12-digit
      isNumeric: true
    }
  }
});

module.exports = User;
