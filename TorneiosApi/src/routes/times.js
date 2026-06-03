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

router.get('/', async (req, res) => {
  const times = await Time.findAll({ where: { fk_id_usuario: req.userId } });
  res.json(times);
});

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

router.delete('/:id', async (req, res) => {
  const deleted = await Time.destroy({ where: { id: req.params.id, fk_id_usuario: req.userId } });
  if (!deleted) return res.status(404).json({ error: 'Time não encontrado' });
  res.json({ message: 'Time removido' });
});

module.exports = router;