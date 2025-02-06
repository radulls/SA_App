const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  getReportTopics,
  reportUser,
  getUserReports,
  deleteReport,
} = require('../controllers/reportController');

const router = express.Router();

// Получить список тем жалоб
router.get('/topics', getReportTopics);

// Отправить жалобу (только авторизованные пользователи)
router.post('/submit', verifyToken, reportUser);

// Получить список всех жалоб (только для админов)
router.get('/all', verifyToken, isAdmin, getUserReports);

// Удалить жалобу (только для админов)
router.delete('/:reportId', verifyToken, isAdmin, deleteReport);

module.exports = router;
