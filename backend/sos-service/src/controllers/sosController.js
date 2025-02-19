const SosReport = require('../models/SosReport');
const SosHelper = require('../models/SosHelper');
const SosTags = require('../models/SosTag');
const mongoose = require('mongoose');
const axios = require('axios');
const CancellationReasons = require('../models/SosCancellationReason')

// 📌 Создание SOS-сигнала
exports.createSosSignal = async (req, res) => {
  try {
    console.log("📩 Данные, полученные на сервере:", req.body);
    console.log("📷 Загруженные файлы (Multer):", req.files); // ✅ Файлы должны быть здесь
    const userId = req.user.id;
    const { location, tags, title, description } = req.body;
    if (!userId || !location || !title || !tags || tags.length === 0) {
      return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }
    const tagObjects = await SosTags.find({ _id: { $in: tags } }, '_id');
    const tagIds = tagObjects.map(tag => tag._id);
    if (tagIds.length !== tags.length) {
      return res.status(400).json({ error: 'Некоторые теги не найдены в базе' });
    }
    // ✅ Теперь `req.files` уже массив, просто маппим `path`
    const photos = req.files ? req.files.map(file => file.path) : [];
    const newSos = new SosReport({
      userId: new mongoose.Types.ObjectId(userId),
      location,
      tags: tagIds,
      title,
      description,
      photos // ✅ Теперь пути к файлам сохраняются
    });
    await newSos.save();
    console.log("✅ SOS-сигнал успешно создан:", newSos);
    res.status(201).json({ message: 'SOS-сигнал создан', sos: newSos });
  } catch (error) {
    console.error("❌ Ошибка при создании SOS-сигнала:", error);
    return res.status(500).json({ error: 'Ошибка создания SOS-сигнала', details: error.message });
  }
};

// 📌 Обновление SOS-сигнала
exports.updateSosSignal = async (req, res) => {
  try {
    const { sosId } = req.params;
    const userId = req.user.id;
    const { title, description, location, tags, existingPhotos } = req.body;

    console.log("📩 Данные для обновления:", req.body);

    if (!mongoose.Types.ObjectId.isValid(sosId)) {
      return res.status(400).json({ error: "Неверный формат ID" });
    }

    const sosSignal = await SosReport.findById(sosId);
    if (!sosSignal) {
      return res.status(404).json({ error: "SOS-сигнал не найден" });
    }

    if (sosSignal.userId.toString() !== userId) {
      return res.status(403).json({ error: "Вы не можете редактировать этот сигнал" });
    }

    // Обновляем данные
    sosSignal.title = title || sosSignal.title;
    sosSignal.description = description || sosSignal.description;
    sosSignal.location = location || sosSignal.location;
    sosSignal.tags = tags || sosSignal.tags;

    // 1️⃣ **Обрабатываем фото**
    let finalPhotos = existingPhotos ? JSON.parse(existingPhotos) : sosSignal.photos;

    // 2️⃣ **Добавляем новые фото**
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => file.path);
      finalPhotos = [...finalPhotos, ...newPhotos];
    }
    sosSignal.photos = finalPhotos;
    await sosSignal.save();
    console.log("✅ SOS-сигнал обновлен:", sosSignal);
    res.json({ message: "SOS-сигнал обновлен", sos: sosSignal });
  } catch (error) {
    console.error("❌ Ошибка при обновлении SOS-сигнала:", error.message);
    res.status(500).json({ error: "Ошибка при обновлении SOS-сигнала" });
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

exports.getSosTags = async (req, res) => {
  try {
    const sosTags = await SosTags.find();
    res.json(sosTags)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении SOS-тэгов' })
  }
};

exports.getCancellationReasons = async (req, res) => {
  try {
    const cancellationReasons = await CancellationReasons.find();
    res.json(cancellationReasons)
  } catch (error){
    res.status(500).json({ error: 'Ошибка при получении причин отмены' })
  }
};

// 📌 Получение конкретного SOS-сигнала по ID
exports.getSosSignalById = async (req, res) => {
  try {
    const { sosId } = req.params;
    console.log("📡 Получаем SOS-сигнал с ID:", sosId);
    if (!mongoose.Types.ObjectId.isValid(sosId)) {
      console.error("❌ Ошибка: Неверный формат ObjectId");
      return res.status(400).json({ error: "Неверный формат ID" });
    }
    // 1️⃣ Получаем сам SOS-сигнал (без данных о пользователе)
    const sosReport = await SosReport.findById(sosId).populate('tags', 'name');

    if (!sosReport) {
      console.error("❌ Ошибка: SOS-сигнал не найден в базе!");
      return res.status(404).json({ error: "SOS-сигнал не найден" });
    }
    // 2️⃣ Запрашиваем данные о пользователе из `user-service`
    let userData = null;
    try {
      const userResponse = await axios.get(`http://localhost:5001/api/users/profile/${sosReport.userId}`);
      console.log("✅ Данные пользователя:", userResponse.data); // <--- ЛОГИРУЕМ ОТВЕТ
      userData = userResponse.data;
    } catch (err) {
      console.error("⚠️ Ошибка запроса в user-service:", err.message);
    }

    // 3️⃣ Отправляем объединенные данные
    res.json({ ...sosReport.toObject(), user: userData });
  } catch (error) {
    console.error("❌ Ошибка при получении SOS-сигнала:", error.message);
    res.status(500).json({ error: "Ошибка при получении SOS-сигнала", details: error.message });
  }
};

// 📌 Удаление SOS-сигнала (Только автор)
exports.cancelSosSignal = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { reasonId } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(sosId) || !mongoose.Types.ObjectId.isValid(reasonId)) {
      return res.status(400).json({ error: "Неверный формат ID" });
    }
    const sosReport = await SosReport.findById(sosId);
    if (!sosReport) {
      return res.status(404).json({ error: "SOS-сигнал не найден" });
    }
    if (sosReport.userId.toString() !== userId) {
      return res.status(403).json({ error: "Вы не можете отменить этот сигнал" });
    }
    const reason = await CancellationReasons.findById(reasonId);
    if (!reason) {
      return res.status(400).json({ error: "Причина отмены не найдена" });
    }
    sosReport.status = 'canceled';
    sosReport.cancellationReason = reasonId;
    sosReport.updatedAt = Date.now();
    await sosReport.save();
    res.json({ message: "SOS-сигнал отменён", sos: sosReport });
  } catch (error) {
    console.error("❌ Ошибка при отмене SOS-сигнала:", error.message);
    res.status(500).json({ error: "Ошибка при отмене SOS-сигнала" });
  }
};

// 📌 Отметить пользователя как помощника
exports.markAsHelper = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ ID из токена
    const { sosId } = req.body;

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

