import { Platform } from 'react-native';

export async function convertMovToMp4(inputUri: string | File | Blob): Promise<string> {
  if (Platform.OS === 'web') {
    const mod = await import('./web.safe');
    return mod.convertMovToMp4(inputUri);
  } else {
    const mod = await import('./native');
    return mod.convertMovToMp4(inputUri as string); // 👈 приведение типа
  }
}