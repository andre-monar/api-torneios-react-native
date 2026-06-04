const express = require('express');
const multer  = require('multer');
const path    = require('path');
const auth    = require('../middleware/auth');
const { Time } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.use(auth);

/**
 * @swagger
 * /times:
 *   get:
 *     summary: Listar times do usuário
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de times
 *       401:
 *         description: Não autorizado
 */
router.get('/', async (req, res) => {
  const times = await Time.findAll({ where: { fk_id_usuario: req.userId } });
  res.json(times);
});

/**
 * @swagger
 * /times:
 *   post:
 *     summary: Criar novo time
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [sigla, nome]
 *             properties:
 *               sigla:
 *                 type: string
 *                 example: PAL
 *               nome:
 *                 type: string
 *                 example: Palmeiras
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Time criado
 *       400:
 *         description: Erro de validação
 */
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { sigla, nome } = req.body;
    const imagem = req.file ? req.file.filename : null;
    const time = await Time.create({ sigla, nome, imagem, fk_id_usuario: req.userId });
    res.status(201).json(time);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /times/{id}:
 *   put:
 *     summary: Atualizar time
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sigla:
 *                 type: string
 *               nome:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Time atualizado
 *       404:
 *         description: Time não encontrado
 */
router.put('/:id', upload.single('imagem'), async (req, res) => {
  try {
    const { sigla, nome } = req.body;
    const updates = { sigla, nome };
    if (req.file) updates.imagem = req.file.filename;
    const [updated] = await Time.update(updates, {
      where: { id: req.params.id, fk_id_usuario: req.userId },
    });
    if (!updated) return res.status(404).json({ error: 'Time não encontrado' });
    const time = await Time.findByPk(req.params.id);
    res.json(time);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /times/{id}:
 *   delete:
 *     summary: Remover time
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Time removido
 *       404:
 *         description: Time não encontrado
 */
router.delete('/:id', async (req, res) => {
  const deleted = await Time.destroy({ where: { id: req.params.id, fk_id_usuario: req.userId } });
  if (!deleted) return res.status(404).json({ error: 'Time não encontrado' });
  res.json({ message: 'Time removido' });
});

module.exports = router;