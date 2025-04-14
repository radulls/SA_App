const Code = require('../models/Code');
const crypto = require('crypto');

async function generateCode(type, userId) {
  if (!['user', 'admin'].includes(type)) {
    throw new Error('❌ Неверный тип кода. Доступные варианты: user, admin.');
  }

  let code;
  let isUnique = false;

  while (!isUnique) {
    code = `CODE_${crypto.randomBytes(4).toString('hex').toUpperCase()}`; // Уникальный 8-значный код
    const existingCode = await Code.findOne({ code });
    if (!existingCode) isUnique = true;
  }

  // Создаём код с привязкой к создателю
  const newCode = new Code({ code, type, createdBy: userId });
  await newCode.save();
  
  console.log('✅ Код успешно записан в базу:', newCode);

  return newCode;
}

module.exports = { generateCode };
