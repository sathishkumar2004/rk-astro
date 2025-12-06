const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Admin = require('./Admin');

const Star = sequelize.define('Star', {
  postId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  starId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 27,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id',
    },
  }
});

Star.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Star;
