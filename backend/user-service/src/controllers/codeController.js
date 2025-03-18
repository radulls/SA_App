const { generateCode } = require('../services/codeService');
const User = require('../models/User');
const Code = require('../models/Code');

async function createCode(req, res) {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (user.role === 'admin' && type !== 'user') {
      return res.status(403).json({ message: 'Админ может создавать только коды пользователей' });
    }

    if (!['user', 'admin'].includes(type)) {
      return res.status(400).json({ message: 'Неверный тип кода' });
    }

    // Генерируем код и передаём userId создателя
    const newCode = await generateCode(type, userId);

    res.status(201).json({ code: newCode.code, type: newCode.type, createdBy: userId });

  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

async function getUsersByInviteCode(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    const userId = req.user.id;
    console.log('🔍 Ищем пользователей, приглашенных пользователем:', userId);
    const invitedUsers = await User.find({ invitedBy: userId })
      .select('firstName lastName username profileImage');
    if (!invitedUsers || invitedUsers.length === 0) {
      console.log('❌ Нет приглашенных пользователей.');
      return res.status(200).json([]);
    }
    console.log('✅ Найдено приглашенных пользователей:', invitedUsers.length);
    res.status(200).json(invitedUsers);

  } catch (error) {
    console.error('❌ Ошибка при получении приглашенных пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

async function getUserCodes(req, res) {
  try {
    const userId = req.user.id;

    const codes = await Code.find({ createdBy: userId })
      .select('code type isUsed usedAt createdAt');

    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

module.exports = { createCode, getUsersByInviteCode, getUserCodes };
