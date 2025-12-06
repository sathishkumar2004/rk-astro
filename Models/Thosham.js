const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Thosham = sequelize.define('Thosham', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
  },
});

module.exports = Thosham;
