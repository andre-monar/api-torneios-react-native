const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Jogo = sequelize.define('Jogo', {
  fk_id_time1: { type: DataTypes.INTEGER, allowNull: false },
  fk_id_time2: { type: DataTypes.INTEGER, allowNull: false },
  gols_time1:  { type: DataTypes.INTEGER, allowNull: false },
  gols_time2:  { type: DataTypes.INTEGER, allowNull: false },
  fk_id_usuario: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Jogo;