const UserReport = require('../models/UserReports');
const User = require('../models/User');
const ReportTopic = require('../models/ReportTopics');

// Получить список тем жалоб
const getReportTopics = async (req, res) => {
  try {
    const topics = await ReportTopic.find();
    res.status(200).json(topics);
  } catch (error) {
    console.error('Ошибка при получении тем жалоб:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Отправить жалобу на пользователя
const reportUser = async (req, res) => {
  try {
    const { reportedUserId, topicId } = req.body;
    const reportingUserId = req.user.id; // ID пользователя из токена

    if (!reportedUserId || !topicId) {
      return res.status(400).json({ message: 'Необходимо указать ID пользователя и причину жалобы' });
    }

    // Проверяем, существует ли пользователь, на которого жалуются
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем, существует ли тема жалобы
    const topic = await ReportTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Тема жалобы не найдена' });
    }

    // Создаём жалобу
    const report = new UserReport({
      reportedUser: reportedUserId,
      reportingUser: reportingUserId,
      topic: topicId,
    });

    await report.save();

    res.status(201).json({ message: 'Жалоба успешно отправлена' });
  } catch (error) {
    console.error('Ошибка при отправке жалобы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить список жалоб (для админов)
const getUserReports = async (req, res) => {
  try {
    const reports = await UserReport.find()
      .populate('reportedUser', 'username profileImage')
      .populate('reportingUser', 'username')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Ошибка при получении списка жалоб:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить жалобу (для админов)
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await UserReport.findByIdAndDelete(reportId);
    res.status(200).json({ message: 'Жалоба удалена' });
  } catch (error) {
    console.error('Ошибка при удалении жалобы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = {
  getReportTopics,
  reportUser,
  getUserReports,
  deleteReport,
};
