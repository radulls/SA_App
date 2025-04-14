let convertMovToMp4Safe: (input: string | File | Blob) => Promise<string> = async (input) => {
  console.warn('⚠️ Используем заглушку ffmpeg');
  return typeof input === 'string' ? input : URL.createObjectURL(input as any);
};

// Инициализация в фоне, без `await`
(async () => {
  try {
    const realImpl = await import('./web');
    convertMovToMp4Safe = realImpl.convertMovToMp4;
  } catch (e) {
    console.warn('⚠️ FFmpeg не поддерживается на этой платформе:', e);
  }
})();

export { convertMovToMp4Safe as convertMovToMp4 };
