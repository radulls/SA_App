let real: typeof import('./web').processVideo | null = null;

export async function processVideo(options: Parameters<typeof import('./web').processVideo>[0]) {
  if (!real) {
    try {
      const mod = await import('./web');
      real = mod.processVideo;
      console.log('✅ Реальная версия processVideo загружена');
    } catch (e) {
      console.warn('🪫 FFMPEG не поддерживается, используем заглушку');
      return null;
    }
  }

  return real(options);
}
