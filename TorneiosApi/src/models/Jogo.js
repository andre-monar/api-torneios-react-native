const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Jogo = sequelize.define('Jogo', {
  fk_id_time1: { type: DataTypes.INTEGER, allowNull: false },
  fk_id_time2: { type: DataTypes.INTEGER, allowNull: false },
  gols_time1:  { type: DataTypes.INTEGER, allowNull: false },
  gols_time2:  { type: DataTypes.INTEGER, allowNull: false },
  fk_id_usuario: { type: DataTypes.INTEGER, allowNull: false },
}, {
  validate: {
    timesDiferentes() {
      if (this.fk_id_time1 === this.fk_id_time2) {
        throw new Error('Time 1 e Time 2 devem ser diferentes.');
      }
    },
  },
});

module.exports = Jogo;