const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Raasi = sequelize.define('Raasi', {
  postId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  raasiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
  },
      type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'raasi',
  timestamps: true,
});

module.exports = Raasi;
