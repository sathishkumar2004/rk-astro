const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Admin = require('./Admin');

const Palan = sequelize.define('Palan', {
  palanId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    validate: {
      min: 1,
      max: 9
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
    type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
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

Palan.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Palan;
