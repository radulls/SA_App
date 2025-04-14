import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface Props {
  uri: string;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ResizeMode;
  useNativeControls?: boolean;
  shouldPlay?: boolean;
  isMuted?: boolean;
  loop?: boolean;
}

const CustomVideo: React.FC<Props> = ({
  uri,
  style,
  resizeMode = ResizeMode.CONTAIN,
  useNativeControls = true,
  shouldPlay = false,
  isMuted = true,
  loop = false,
}) => {
  if (Platform.OS === 'web') {
    return (
      <video
        src={uri}
        style={[{ width: '100%', height: '100%', objectFit: 'cover' }, style] as any}
        controls={useNativeControls}
        muted={isMuted}
        autoPlay={shouldPlay}
        loop={loop}
      />
    );
  }

  return (
    <Video
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      shouldPlay={shouldPlay}
      isMuted={isMuted}
      isLooping={loop}
      useNativeControls={useNativeControls}
    />
  );
};

export default CustomVideo;
