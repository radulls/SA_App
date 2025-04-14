import { Platform } from 'react-native';

export async function processVideo(
  
  options: {
    uri: string;
    start: number;
    end: number;
    crop?: { x: number; y: number; width: number; height: number };
  }
): Promise<string | null> {
  console.log('🌍 processVideo index.ts, Platform:', Platform.OS);
  if (Platform.OS === 'web') {
    const mod = await import('./web.safe');
    return mod.processVideo(options);
  } else {
    const mod = await import('./native');
    return mod.processVideo(options);
  }
}
