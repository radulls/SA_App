const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// Конфигурация хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Директория для сохранения файлов
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Файлы этого типа не поддерживаются'), false);
  }
};

// Обработка изображения с помощью ImageMagick
const processImage = (filePath, isPng) =>
  new Promise((resolve, reject) => {
    const outputPath = filePath.replace(/(\.jpeg|\.jpg|\.png)$/i, `${isPng ? '.png' : '.jpg'}`);
    const qualityOption = isPng ? '-strip' : '-quality 85';
    const command = `magick convert ${filePath} -resize 800x ${qualityOption} ${outputPath}`; // Изменено на фиксированную ширину

    exec(command, (error) => {
      if (error) {
        console.error(`Ошибка обработки изображения ${filePath}:`, error.message);
        reject(error);
      } else {
        console.log(`Файл обработан и сохранён: ${outputPath}`);
        resolve(outputPath);
      }
    });
  });

// Middleware для обработки изображений
const processUploadedFiles = (req, res, next) => {
  if (!req.files) return next(); // Если файлов нет, пропускаем

  const tasks = Object.keys(req.files).map((key) =>
    Promise.all(
      req.files[key].map(async (file) => {
        const isPng = file.mimetype === 'image/png';
        try {
          const processedPath = await processImage(file.path, isPng);
          file.processedPath = processedPath; // Сохраняем путь обработанного файла
        } catch (error) {
          console.error(`Ошибка обработки файла ${file.originalname}:`, error);
        }
      })
    )
  );

  Promise.all(tasks)
    .then(() => next())
    .catch((error) => res.status(500).json({ message: 'Ошибка обработки изображений', error }));
};

// Экспортируем multer с обработкой
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Ограничение 5MB
  },
  fileFilter,
});

module.exports = {
  upload,
  processUploadedFiles,
};
