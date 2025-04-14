const BlockedUsers = require('../models/BlockedUsers');

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const blockerId = req.user.id; // ID залогиненного пользователя

    if (!userId) return res.status(400).json({ message: "ID пользователя не указан" });

    // Создаем запись в таблице BlockedUsers
    await BlockedUsers.create({ blocker: blockerId, blocked: userId });

    res.json({ message: "Пользователь заблокирован" });
  } catch (error) {
    console.error("Ошибка блокировки:", error);
    res.status(500).json({ message: "Ошибка блокировки" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const blockerId = req.user.id;

    if (!userId) return res.status(400).json({ message: "ID пользователя не указан" });

    // Удаляем запись о блокировке
    await BlockedUsers.findOneAndDelete({ blocker: blockerId, blocked: userId });

    res.json({ message: "Пользователь разблокирован" });
  } catch (error) {
    console.error("Ошибка разблокировки:", error);
    res.status(500).json({ message: "Ошибка разблокировки" });
  }
};

exports.isBlocked = async (req, res) => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    const isBlocked = await BlockedUsers.exists({ blocker: blockerId, blocked: userId });

    res.json({ isBlocked: Boolean(isBlocked) });
  } catch (error) {
    console.error("Ошибка проверки блокировки:", error);
    res.status(500).json({ message: "Ошибка проверки блокировки" });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const blockerId = req.user.id;
    console.log(`🔍 Получение списка заблокированных для пользователя: ${blockerId}`);

    const blockedUsers = await BlockedUsers.find({ blocker: blockerId })
      .populate('blocked', 'firstName lastName username profileImage');

    console.log("✅ Список заблокированных пользователей:", blockedUsers);

    res.json({ blockedUsers });
  } catch (error) {
    console.error("❌ Ошибка получения списка заблокированных:", error);
    res.status(500).json({ message: "Ошибка получения списка заблокированных" });
  }
};

