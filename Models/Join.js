const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Join = sequelize.define('Join', {
  JoinId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Strong', 'Weak', 'Positive', 'Negative'),
    allowNull: true
  },
});

module.exports = Join;
