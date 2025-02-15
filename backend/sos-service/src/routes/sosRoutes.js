const express = require('express');
const {
  createSosSignal,
  getSosSignals,
  getSosSignalById,
  deleteSosSignal,
  markAsHelper,
  getSosHelpers
} = require('../controllers/sosController');

const router = express.Router();

router.post('/create', createSosSignal);
router.get('/', getSosSignals);
router.get('/:sosId', getSosSignalById);  // ✅ Получение конкретного SOS-сигнала
router.delete('/:sosId', deleteSosSignal); // ✅ Удаление SOS-сигнала
router.post('/help', markAsHelper);
router.get('/helpers/:sosId', getSosHelpers);

module.exports = router;
