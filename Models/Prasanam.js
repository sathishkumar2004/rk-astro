const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Prasanam = sequelize.define('Prasanam', {
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
}, {
  tableName: 'prasanams',
  timestamps: true
});

module.exports = Prasanam;
