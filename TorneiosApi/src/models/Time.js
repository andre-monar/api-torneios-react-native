const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Time = sequelize.define('Time', {
  sigla: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      len: [3, 3],
    },
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fk_id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  indexes: [
    { unique: true, fields: ['sigla', 'fk_id_usuario'] },
  ],
});

module.exports = Time;