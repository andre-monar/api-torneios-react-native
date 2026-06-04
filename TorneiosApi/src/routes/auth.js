const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado, retorna token JWT
 *       400:
 *         description: Erro de validação
 */
router.post('/register', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ email, senha: hash });
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas' });

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;