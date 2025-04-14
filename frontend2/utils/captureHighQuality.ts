export const renderTransformedImageToBase64 = async ({
  imageUri,
  scale = 1,
  translateX = 0,
  translateY = 0,
  outputSize = 600,
}: {
  imageUri: string;
  scale: number;
  translateX: number;
  translateY: number;
  outputSize?: number;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('No canvas context');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = '#F3F3F3'; // фон
      ctx.fillRect(0, 0, outputSize, outputSize);

      ctx.translate(outputSize / 2 + translateX, outputSize / 2 + translateY);
      ctx.scale(scale, scale);
      ctx.translate(-img.width / 2, -img.height / 2);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = imageUri;
  });
};
