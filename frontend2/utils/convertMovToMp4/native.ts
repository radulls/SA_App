export async function convertMovToMp4(inputUri: string): Promise<string> {
  const { FFmpegKit } = require('ffmpeg-kit-react-native');
  const FileSystem = require('expo-file-system');

  const isFileUri = inputUri.startsWith('file://');
  const inputPath = isFileUri ? inputUri : `${FileSystem.cacheDirectory}input.mov`;
  const outputPath = `${FileSystem.cacheDirectory}output.mp4`;

  if (!isFileUri) {
    const downloadRes = await FileSystem.downloadAsync(inputUri, inputPath);
    if (!downloadRes?.uri) {
      throw new Error(`Не удалось скачать видео с URI: ${inputUri}`);
    }
  }

  const command = `-y -i "${inputPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -vcodec h264_videotoolbox -pix_fmt yuv420p -acodec aac -movflags +faststart "${outputPath}"`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (!returnCode.isValueSuccess()) {
    throw new Error('FFmpeg: ошибка при конвертации');
  }

  return outputPath;
}
