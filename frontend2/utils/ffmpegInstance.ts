import { createFFmpeg, fetchFile as fetchFileFromFfmpeg } from '@ffmpeg/ffmpeg';

let ffmpegInstance: ReturnType<typeof createFFmpeg> | null = null;

export const getFfmpegInstance = () => {
  if (!ffmpegInstance) {
    ffmpegInstance = createFFmpeg({
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    });
  }

  return {
    ffmpeg: ffmpegInstance,
    fetchFile: fetchFileFromFfmpeg,
  };
};