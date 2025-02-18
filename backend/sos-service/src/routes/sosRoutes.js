const express = require('express');
const {
  createSosSignal,
  getSosSignals,
  getSosSignalById,
  deleteSosSignal,
  markAsHelper,
  getSosHelpers,
  getSosTags,
} = require('../controllers/sosController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { upload, processUploadedFiles } = require('../middlewares/upload.jsx');
const router = express.Router();

router.post(
  '/create',
  verifyToken,
  (req, res, next) => {
    console.log("📩 Content-Type:", req.headers['content-type']);
    next();
  },
  upload.array('photos', 5),
  (req, res, next) => {
    console.log("📷 Загруженные файлы (Multer):", req.files);
    next();
  },
  processUploadedFiles,
  createSosSignal
);

router.get('/', getSosSignals);
router.get('/tags', getSosTags);
router.get('/:sosId', getSosSignalById);
router.delete('/:sosId', verifyToken, deleteSosSignal);
router.post('/help', verifyToken, markAsHelper);
router.get('/helpers/:sosId', getSosHelpers);

module.exports = router;