const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PermissionRequest = sequelize.define('PermissionRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  adminId: { type: DataTypes.INTEGER, allowNull: false },
  moduleName: { type: DataTypes.STRING, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
    defaultValue: 'pending' 
  }
}, {
  tableName: 'permission_requests',
  timestamps: true
});

module.exports = PermissionRequest;
