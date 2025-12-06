const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Laknam = sequelize.define('Laknam', {
  postId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  LaknamId: {
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
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'laknam',
  timestamps: true,
});

module.exports = Laknam;
