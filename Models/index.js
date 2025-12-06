const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../db.js");

// Models
const Meta = sequelize.define('Meta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  place: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  local_time: { type: DataTypes.DATE },
  utc_time: { type: DataTypes.DATE }
}, { tableName: 'meta', timestamps: true, createdAt: 'created_at', updatedAt: false });

const RasiChart = sequelize.define('RasiChart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meta_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.TEXT },
  rasi: { type: DataTypes.TEXT },
  degree: { type: DataTypes.TEXT },
  nakshatra: { type: DataTypes.TEXT },
  pada: { type: DataTypes.INTEGER },
  longitude: { type: DataTypes.FLOAT },
  latitude: { type: DataTypes.FLOAT }
}, { tableName: 'rasi_chart', timestamps: false });

const NavamsaChart = sequelize.define('NavamsaChart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meta_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.TEXT },
  navamsa: { type: DataTypes.TEXT },
  nakshatra: { type: DataTypes.TEXT },
  pada: { type: DataTypes.INTEGER },
  longitude: { type: DataTypes.FLOAT },
  latitude: { type: DataTypes.FLOAT }
}, { tableName: 'navamsa_chart', timestamps: false });

// Associations
Meta.hasMany(RasiChart, { foreignKey: 'meta_id', onDelete: 'CASCADE' });
RasiChart.belongsTo(Meta, { foreignKey: 'meta_id' });

Meta.hasMany(NavamsaChart, { foreignKey: 'meta_id', onDelete: 'CASCADE' });
NavamsaChart.belongsTo(Meta, { foreignKey: 'meta_id' });

module.exports = { sequelize, Meta, RasiChart, NavamsaChart };
