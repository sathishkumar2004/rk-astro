const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Bookmark = sequelize.define('Bookmark', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  part: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m1: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m2: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m3: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m4: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m5: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  m6: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  }
}, {
  tableName: 'bookmarks',
  timestamps: true
});

module.exports = Bookmark;
