const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Giraham = sequelize.define('Giraham', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  girahamId: {
    type: DataTypes.INTEGER,
    allowNull: false   // used as moduleId for permission check
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false   // which admin created this post
  },
  description: {
    type: DataTypes.TEXT,  // better to allow longer content
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
  },
}, {
  tableName: 'girahams',
  timestamps: true
});

module.exports = Giraham;
