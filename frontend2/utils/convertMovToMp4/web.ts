import { loadFfmpeg } from '../../external/ffmpegLoader.web';

export async function convertMovToMp4(inputUri: string | File | Blob): Promise<string> {
  try {
    const { ffmpeg, fetchFile } = await loadFfmpeg();

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputFileName = 'input.mov';
    const outputFileName = 'output.mp4';

    let inputData: Uint8Array;

    if (typeof inputUri === 'string') {
      if (inputUri.startsWith('data:')) {
        const base64Data = inputUri.split(',')[1];
        inputData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      } else {
        inputData = await fetchFile(inputUri);
      }
    } else {
      const arrayBuffer = await inputUri.arrayBuffer();
      inputData = new Uint8Array(arrayBuffer);
    }

    ffmpeg.FS('writeFile', inputFileName, inputData);

    await ffmpeg.run(
      '-i', inputFileName,
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', // делает чётные размеры
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',                     // 🔥 это ключ!
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputFileName
    );
    
    const output = ffmpeg.FS('readFile', outputFileName);

    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);

    return URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));
  } catch (error) {
    console.error('❌ FFmpeg conversion error:', error);
    throw error;
  }
}
