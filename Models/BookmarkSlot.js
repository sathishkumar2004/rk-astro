const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Bookmark = require('./Bookmark');

const BookmarkSlot = sequelize.define('BookmarkSlot', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  slotNumber: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'bookmark_slots',
  timestamps: true
});

// Relations
Bookmark.hasMany(BookmarkSlot, { foreignKey: 'bookmarkId', as: 'slots' });
BookmarkSlot.belongsTo(Bookmark, { foreignKey: 'bookmarkId', as: 'bookmark' });

module.exports = BookmarkSlot;
