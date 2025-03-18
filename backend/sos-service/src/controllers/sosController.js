const SosReport = require('../models/SosReport');
const SosHelper = require('../models/SosHelper');
const SosTags = require('../models/SosTag');
const mongoose = require('mongoose');
const axios = require('axios');
const CancellationReasons = require('../models/SosCancellationReason')
const SosConfirmedHelper = require('../models/SosConfirmedHelper')

const USER_SERVICE_URL = 'http://89.108.118.249:5001/api/users/profile';


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
        const userResponse = await axios.get(`http://89.108.118.249:5001/api/users/profile/${sosReport.userId}`);
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

  // ✅ Отклик на SOS-сигнал
  exports.markAsHelper = async (req, res) => {
    try {
      const { sosId } = req.body;
      const userId = req.user.id; // ID пользователя из токена

      // Проверяем, существует ли SOS-сигнал
      const sosSignal = await SosReport.findById(sosId);
      if (!sosSignal) {
        return res.status(404).json({ message: 'SOS-сигнал не найден' });
      }

      // Проверяем, откликался ли уже пользователь
      const existingHelper = await SosHelper.findOne({ sosId, userId });
      if (existingHelper) {
        return res.status(400).json({ message: 'Вы уже откликнулись на этот сигнал' });
      }

      // Создаём запись об отклике
      const helper = new SosHelper({ sosId, userId });
      await helper.save();

      return res.status(201).json({ message: 'Вы успешно откликнулись на SOS-сигнал' });
    } catch (error) {
      console.error('❌ Ошибка при отклике на SOS-сигнал:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  // ✅ Получение списка откликнувшихся
  exports.getSosHelpers = async (req, res) => {
    try {
      const { sosId } = req.params;
  
      // 1️⃣ Получаем всех помощников
      const helpers = await SosHelper.find({ sosId });
  
      if (!helpers.length) {
        return res.status(200).json([]); // Если нет помощников — возвращаем пустой массив
      }
  
      // 2️⃣ Собираем ID пользователей
      const userIds = helpers.map(helper => helper.userId.toString());
  
      // 3️⃣ Запрашиваем данные пользователей
      let users = [];
      try {
        const userResponse = await axios.post(`http://localhost:5001/api/users/profiles-by-ids`, { userIds });
  
        if (userResponse.data && Array.isArray(userResponse.data)) {
          users = userResponse.data;
        } else {
          console.error("⚠️ Некорректный ответ от user-service:", userResponse.data);
        }
      } catch (err) {
        console.error("⚠️ Ошибка запроса в user-service:", err.message);
      }
  
      // 4️⃣ Объединяем помощников с их данными (проверяем `users`)
      const helpersWithUserData = helpers.map(helper => {
        const userData = users.find(user => user?._id?.toString() === helper.userId?.toString()) || null;
        return {
          _id: helper._id,
          sosId: helper.sosId,
          createdAt: helper.createdAt,
          user: userData
        };
      });
  
      res.status(200).json(helpersWithUserData);
    } catch (error) {
      console.error('❌ Ошибка при получении списка помощников:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };
  
  // 📌 Проверить, является ли пользователь помощником этого SOS
  exports.isUserHelper = async (req, res) => {
    try {
      const { sosId } = req.params;
      const userId = req.user.id; // ID пользователя из токена

      // Проверяем, есть ли пользователь среди помощников
      const helper = await SosHelper.findOne({ sosId, userId });

      res.json({ isHelper: !!helper }); // true, если помощник, иначе false
    } catch (error) {
      console.error("❌ Ошибка при проверке статуса помощника:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

    // 📌 Подтверждение помощников
  exports.confirmHelpers = async (req, res) => {
    try {
      const { sosId, helpers } = req.body; // helpers = массив userId
      const userId = req.user.id;

      if (!mongoose.Types.ObjectId.isValid(sosId)) {
        return res.status(400).json({ error: "Неверный формат ID" });
      }

      const sosSignal = await SosReport.findById(sosId);
      if (!sosSignal) {
        return res.status(404).json({ error: "SOS-сигнал не найден" });
      }

      if (sosSignal.userId.toString() !== userId) {
        return res.status(403).json({ error: "Вы не можете подтверждать помощников для этого сигнала" });
      }

      // Записываем подтверждённых помощников
      const confirmedHelpers = helpers.map(helperId => ({
        sosId,
        userId: helperId,
        confirmedBy: userId
      }));

      await SosConfirmedHelper.insertMany(confirmedHelpers);

      // Обновляем статус SOS-сигнала
      sosSignal.status = 'resolved';
      await sosSignal.save();

      res.status(200).json({ message: "Помощники подтверждены", confirmedHelpers });
    } catch (error) {
      console.error("❌ Ошибка при подтверждении помощников:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  // 📌 Получение подтверждённых помощников
  exports.getConfirmedHelpers = async (req, res) => {
    try {
      const { sosId } = req.params;

      const confirmedHelpers = await SosConfirmedHelper.find({ sosId }).populate('userId', 'username email');

      res.json(confirmedHelpers);
    } catch (error) {
      console.error('❌ Ошибка при получении списка подтверждённых помощников:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  exports.getActiveSosByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log(`📡 Получаем активный SOS-сигнал для userId: ${userId}`);

        if (!userId) {
            return res.status(400).json({ message: "userId обязателен" });
        }

        // Логируем тип userId
        console.log("🛠️ Тип userId:", typeof userId); 

        // Ищем активный SOS-сигнал
        const activeSos = await SosReport.findOne({ userId, status: "active" }).sort({ createdAt: -1 });

        if (!activeSos) {
            console.warn(`⚠️ У пользователя ${userId} нет активного SOS-сигнала.`);
            return res.status(404).json({ message: "Активный SOS-сигнал не найден" });
        }

        console.log("✅ Найден активный SOS-сигнал:", activeSos);
        res.status(200).json(activeSos);
    } catch (error) {
        console.error("❌ Ошибка поиска активного SOS:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  // 📌 Отмена участия в SOS-сигнале
  exports.leaveSosSignal = async (req, res) => {
    try {
      const { sosId } = req.body;
      const userId = req.user.id; // Получаем ID пользователя из токена

      // Проверяем, есть ли отклик на SOS
      const helper = await SosHelper.findOne({ sosId, userId });
      if (!helper) {
        return res.status(400).json({ message: "Вы не участвуете в этом SOS-сигнале" });
      }

      // Удаляем отклик пользователя
      await SosHelper.deleteOne({ _id: helper._id });

      return res.status(200).json({ message: "Вы покинули SOS-сигнал" });
    } catch (error) {
      console.error("❌ Ошибка выхода из SOS-сигнала:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  exports.checkSosAccess = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`🔍 checkSosAccess вызван\n🔍 userId: ${userId}`);

        // 🔥 Запрашиваем данные о пользователе в user-service
        const userResponse = await axios.get(`${USER_SERVICE_URL}/${userId}`, {
            headers: { Authorization: req.headers.authorization }
        });

        console.log("✅ Ответ от user-service:", userResponse.data);

        if (!userResponse.data || !userResponse.data.user || !userResponse.data.user.createdAt) {
            return res.status(404).json({ error: "Не удалось получить данные о пользователе." });
        }

        const createdAt = new Date(userResponse.data.user.createdAt);
        const now = new Date();
        const diffMilliseconds = now - createdAt;

        // 🔹 Вычисляем оставшееся время до 2 месяцев
        const requiredMilliseconds = 60 * 24 * 60 * 60 * 1000; // 60 дней в миллисекундах
        const remainingMilliseconds = requiredMilliseconds - diffMilliseconds;

        if (remainingMilliseconds > 0) {
            // Вычисляем количество оставшихся месяцев, дней и часов
            const remainingMonths = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24 * 30));
            const remainingDays = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const remainingHours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            console.log(`⚠️ Доступ запрещён. Осталось времени: ${remainingMonths} мес., ${remainingDays} дн., ${remainingHours} ч.`);

            return res.status(403).json({
                access: false,
                message: "Эта функция будет доступна после 2-х месяцев членства.",
                remainingMonths,
                remainingDays,
                remainingHours
            });
        }

        res.status(200).json({ access: true });
    } catch (error) {
        console.error("❌ Ошибка проверки доступа в user-service:", error);
        return res.status(500).json({ message: "Ошибка проверки доступа к SOS" });
    }
};
