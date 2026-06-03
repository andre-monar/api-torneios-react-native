const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

sequelize.query('PRAGMA foreign_keys = ON');

module.exports = sequelize;