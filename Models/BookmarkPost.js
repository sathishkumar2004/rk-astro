const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BookmarkSlot = require('./BookmarkSlot');

const BookmarkPost = sequelize.define('BookmarkPost', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tableName: { type: DataTypes.STRING, allowNull: false },
  tableRecordId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'bookmark_posts',
  timestamps: true
});

// Relations
BookmarkSlot.hasMany(BookmarkPost, { foreignKey: 'bookmarkSlotId', as: 'posts' });
BookmarkPost.belongsTo(BookmarkSlot, { foreignKey: 'bookmarkSlotId', as: 'slot' });

module.exports = BookmarkPost;
