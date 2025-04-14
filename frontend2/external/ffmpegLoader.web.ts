let ffmpegInstance: any = null;

export async function loadFfmpeg() {
  if (typeof window === 'undefined') return null;
  if (ffmpegInstance) return ffmpegInstance;

  console.log('[loadFfmpeg] Загружаем локальный ffmpeg.min.js...');

  const script = document.createElement('script');
  script.src = '/ffmpeg/ffmpeg.min.js'; // ✅ локальный путь
  script.async = true;

  return new Promise((resolve, reject) => {
    script.onload = () => {
      if (!(window as any).createFFmpeg) {
        console.error('[loadFfmpeg] ❌ createFFmpeg не найден');
        return reject(new Error('createFFmpeg not found'));
      }

      console.log('[loadFfmpeg] ✅ FFmpeg загружен локально');

      ffmpegInstance = (window as any).createFFmpeg({
        log: true,
        corePath: '/ffmpeg/ffmpeg-core.js', // ✅ локальный путь к ядру
      });

      resolve({
        ffmpeg: ffmpegInstance,
        fetchFile: (window as any).fetchFile,
      });
    };

    script.onerror = (e) => {
      console.error('[loadFfmpeg] ❌ Ошибка загрузки ffmpeg.min.js:', e);
      reject(e);
    };

    document.body.appendChild(script);
  });
}
