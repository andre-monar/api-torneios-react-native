require('dotenv').config();
const express = require('express');
const path    = require('path');
const { sequelize } = require('./src/models');

const authRoutes  = require('./src/routes/auth');
const timesRoutes = require('./src/routes/times');
const jogosRoutes = require('./src/routes/jogos');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth',   authRoutes);
app.use('/times',  timesRoutes);
app.use('/jogos',  jogosRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
});