require('dotenv').config();
const express       = require('express');
const path          = require('path');
const swaggerUi     = require('swagger-ui-express');
const swaggerJsdoc  = require('swagger-jsdoc');
const { sequelize } = require('./src/models');

const authRoutes  = require('./src/routes/auth');
const timesRoutes = require('./src/routes/times');
const jogosRoutes = require('./src/routes/jogos');

const app = express();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Torneios API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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