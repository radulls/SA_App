let ffmpegInstance: any = null;

export async function getFfmpegInstance() {
  if (ffmpegInstance) return ffmpegInstance;

  const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  });

  await ffmpeg.load();

  ffmpegInstance = { ffmpeg, fetchFile };
  return ffmpegInstance;
}
