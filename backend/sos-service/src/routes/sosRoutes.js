const express = require('express');
const {
  createSosSignal,
  updateSosSignal,
  getSosSignals,
  getCancellationReasons,
  getSosSignalById,
  cancelSosSignal,
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
router.get('/cancellation-reasons', getCancellationReasons);
router.get('/tags', getSosTags);
router.post('/cancel/:sosId', verifyToken, cancelSosSignal);
router.put(
  '/:sosId',
  verifyToken,
  upload.array('photos', 5),
  processUploadedFiles,
  updateSosSignal
);
router.get('/:sosId', getSosSignalById);
router.post('/help', verifyToken, markAsHelper);
router.get('/helpers/:sosId', getSosHelpers);

module.exports = router;