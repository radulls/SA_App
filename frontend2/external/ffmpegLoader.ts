let ffmpegInstance: ReturnType<typeof import('@ffmpeg/ffmpeg')['createFFmpeg']> | null = null;
let fetchFileFunc: typeof import('@ffmpeg/ffmpeg').fetchFile | null = null;

export async function loadFfmpeg() {
  if (!ffmpegInstance || !fetchFileFunc) {
    try {
      const ffmpegModule = await (new Function(
        "return import('@ffmpeg/ffmpeg')"
      )()) as typeof import('@ffmpeg/ffmpeg');

      const { createFFmpeg, fetchFile } = ffmpegModule;

      ffmpegInstance = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
      });

      fetchFileFunc = fetchFile;
    } catch (e) {
      console.warn('❌ Не удалось загрузить @ffmpeg/ffmpeg:', e);
      throw e;
    }
  }

  return {
    ffmpeg: ffmpegInstance!,
    fetchFile: fetchFileFunc!,
  };
}
