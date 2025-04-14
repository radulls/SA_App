import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export const processVideo = async ({
  uri,
  start,
  end,
  crop,
}: {
  uri: string;
  start: number;
  end: number;
  crop?: { x: number; y: number; width: number; height: number };
}): Promise<string | null> => {
  const outputUri = `${FileSystem.documentDirectory}edited_${Date.now()}.mp4`;

  let cmd = `-i "${uri}"`;

  if (crop) {
    cmd += ` -vf "crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}"`;
  }

  cmd += ` -ss ${start} -t ${end - start} -c:v mpeg4 -c:a copy -movflags +faststart "${outputUri}"`;

  console.log('📼 FFmpeg CMD:', cmd);

  const session = await FFmpegKit.execute(cmd);
  const returnCode = await session.getReturnCode();

  if (!ReturnCode.isSuccess(returnCode)) {
    const logs = await session.getAllLogsAsString();
    console.error('❌ FFmpeg error:', logs);
    return null;
  }

  const fileInfo = await FileSystem.getInfoAsync(outputUri);
  console.log('✅ Output file info:', fileInfo);
  return fileInfo.exists ? outputUri : null;
};
