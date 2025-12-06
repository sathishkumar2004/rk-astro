const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ThreeJoin = sequelize.define('ThreeJoin', {
  JoinId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ThreeJoin;
