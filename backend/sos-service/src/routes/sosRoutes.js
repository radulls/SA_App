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
  isUserHelper,
  confirmHelpers,
  getConfirmedHelpers,
  getActiveSosByUserId,
  leaveSosSignal,
  checkSosAccess
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
router.get("/active", getActiveSosByUserId);
router.get('/check-access', verifyToken, 
checkSosAccess);
router.post('/help', verifyToken, markAsHelper);
router.put(
  '/:sosId',
  verifyToken,
  upload.array('photos', 5),
  processUploadedFiles,
  updateSosSignal
);
router.get('/:sosId', getSosSignalById);
router.get('/helpers/check/:sosId', verifyToken, isUserHelper);
router.get('/helpers/:sosId', getSosHelpers);
router.post('/confirm-helpers', verifyToken, confirmHelpers);
router.get('/confirmed-helpers/:sosId', getConfirmedHelpers);
router.post('/leave', verifyToken, leaveSosSignal);

module.exports = router;