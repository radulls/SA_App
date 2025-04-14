import { loadFfmpeg } from '../../external/ffmpegLoader.web';

interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProcessVideoOptions {
  uri: string;
  start: number;
  end: number;
  crop?: CropOptions;
}

export async function processVideo({
  uri,
  start,
  end,
  crop,
}: ProcessVideoOptions): Promise<string | null> {
  console.log('⚙️ Начинаем обработку видео:', { uri, start, end, crop });

  try {
    const { ffmpeg, fetchFile } = await loadFfmpeg();

    if (!ffmpeg.isLoaded()) {
      console.log('🪄 Загружаем ffmpeg...');
      await ffmpeg.load();
    }

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    const inputData = uri.startsWith('data:')
      ? Uint8Array.from(atob(uri.split(',')[1]), c => c.charCodeAt(0))
      : await fetchFile(uri);

    console.log('💾 Записываем файл во внутреннюю FS:', inputFileName);
    ffmpeg.FS('writeFile', inputFileName, inputData);

    const args = ['-ss', `${start}`, '-i', inputFileName, '-t', `${end - start}`];

    if (crop) {
      const { x, y, width, height } = crop;
      args.push('-vf', `crop=${width}:${height}:${x}:${y}`);
      console.log(`✂️ Добавляем crop-фильтр: crop=${width}:${height}:${x}:${y}`);
    }

    args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-c:a', 'copy', outputFileName);
    console.log('🚀 Запускаем ffmpeg с аргументами:', args.join(' '));

    await ffmpeg.run(...args);

    console.log('📤 Читаем результат из FS...');
    const data = ffmpeg.FS('readFile', outputFileName);
    if (!data || !data.buffer) {
      console.warn('⚠️ Не удалось прочитать выходной файл.');
      return null;
    }

    console.log('✅ Обработка завершена, создаем URL...');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    console.log('🧹 Удаляем временные файлы...');
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);

    return videoUrl;
  } catch (err) {
    console.error('❌ Ошибка обработки видео:', err);
    return null;
  }
}
