// models/Sin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Sin = sequelize.define('Sin', {
  postId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true   // ✅ make it primaryKey
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sinId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
  },
}, {
  tableName: 'sins',
  timestamps: true
});

module.exports = Sin;
