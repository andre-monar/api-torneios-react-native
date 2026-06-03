const express = require('express');
const auth    = require('../middleware/auth');
const { Jogo, Time } = require('../models');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const jogos = await Jogo.findAll({
    where: { fk_id_usuario: req.userId },
    include: [
      { model: Time, as: 'Time1', attributes: ['sigla', 'nome'] },
      { model: Time, as: 'Time2', attributes: ['sigla', 'nome'] },
    ],
  });
  res.json(jogos);
});

router.post('/', async (req, res) => {
  try {
    const { fk_id_time1, fk_id_time2, gols_time1, gols_time2 } = req.body;
    const jogo = await Jogo.create({ fk_id_time1, fk_id_time2, gols_time1, gols_time2, fk_id_usuario: req.userId });
    res.status(201).json(jogo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await Jogo.destroy({ where: { id: req.params.id, fk_id_usuario: req.userId } });
  if (!deleted) return res.status(404).json({ error: 'Jogo não encontrado' });
  res.json({ message: 'Jogo removido' });
});

module.exports = router;