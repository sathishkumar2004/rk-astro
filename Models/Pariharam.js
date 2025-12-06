const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pariharam = sequelize.define('Pariharam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER, // 1, 2, or 3
    allowNull: false
  }
});

module.exports = Pariharam;
