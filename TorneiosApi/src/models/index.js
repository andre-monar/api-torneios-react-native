const sequelize = require('../database/database');
const Usuario  = require('./Usuario');
const Time     = require('./Time');
const Jogo     = require('./Jogo');

Usuario.hasMany(Time, { foreignKey: 'fk_id_usuario', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Time.belongsTo(Usuario, { foreignKey: 'fk_id_usuario' });

Usuario.hasMany(Jogo, { foreignKey: 'fk_id_usuario', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Jogo.belongsTo(Usuario, { foreignKey: 'fk_id_usuario' });

Time.hasMany(Jogo, { as: 'JogosTime1', foreignKey: 'fk_id_time1', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Time.hasMany(Jogo, { as: 'JogosTime2', foreignKey: 'fk_id_time2', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Jogo.belongsTo(Time, { as: 'Time1', foreignKey: 'fk_id_time1' });
Jogo.belongsTo(Time, { as: 'Time2', foreignKey: 'fk_id_time2' });

module.exports = { sequelize, Usuario, Time, Jogo };