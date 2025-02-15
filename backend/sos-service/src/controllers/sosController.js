const SosReport = require('../models/SosReport');
const SosHelper = require('../models/SosHelper');

// 📌 Создание SOS-сигнала
exports.createSosSignal = async (req, res) => {
  try {
    const { userId, location, tags, title, description, photos } = req.body;

    const newSos = new SosReport({ userId, location, tags, title, description, photos });
    await newSos.save();

    res.status(201).json({ message: 'SOS-сигнал создан', sos: newSos });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания SOS-сигнала' });
  }
};

// 📌 Получение всех SOS-сигналов
exports.getSosSignals = async (req, res) => {
  try {
    const sosReports = await SosReport.find().populate('tags').populate('userId', 'username email');
    res.json(sosReports);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки SOS-сигналов' });
  }
};

// 📌 Получение конкретного SOS-сигнала по ID
exports.getSosSignalById = async (req, res) => {
  try {
    const { sosId } = req.params;

    const sosReport = await SosReport.findById(sosId)
      .populate('tags', 'name')
      .populate('userId', 'username email');

    if (!sosReport) {
      return res.status(404).json({ error: 'SOS-сигнал не найден' });
    }

    res.json(sosReport);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении SOS-сигнала' });
  }
};

// 📌 Удаление SOS-сигнала
exports.deleteSosSignal = async (req, res) => {
  try {
    const { sosId } = req.params;

    const sosReport = await SosReport.findById(sosId);
    if (!sosReport) {
      return res.status(404).json({ error: 'SOS-сигнал не найден' });
    }

    // Удаляем сигнал и всех помощников, связанных с ним
    await SosHelper.deleteMany({ sosId });
    await sosReport.deleteOne();

    res.json({ message: 'SOS-сигнал удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении SOS-сигнала' });
  }
};

// 📌 Отметить пользователя, что он помогает
exports.markAsHelper = async (req, res) => {
  try {
    const { sosId, userId } = req.body;
    const existingHelper = await SosHelper.findOne({ sosId, userId });
    if (existingHelper) {
      return res.status(400).json({ error: 'Вы уже отмечены как помощник' });
    }
    const newHelper = new SosHelper({ sosId, userId });
    await newHelper.save();
    res.status(201).json({ message: 'Помощник добавлен', helper: newHelper });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении помощника' });
  }
};

// 📌 Получить список помощников для конкретного SOS-сигнала
exports.getSosHelpers = async (req, res) => {
  try {
    const helpers = await SosHelper.find({ sosId: req.params.sosId }).populate('userId', 'username email');
    res.json(helpers);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки помощников' });
  }
};
