import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  ViewStyle,
} from 'react-native';

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface Props {
  cropRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  setCropRect: React.Dispatch<React.SetStateAction<Props['cropRect']>>;
  containerSize: { width: number; height: number };
}

const CORNER_SIZE = 24;
const MIN_CROP_SIZE = 60;
const CORNER_LINE_LENGTH = 20;
const CORNER_LINE_WIDTH = 3;

const CropFrameOverlay: React.FC<Props> = ({ cropRect, setCropRect, containerSize }) => {
  const initialCropRectRef = useRef(cropRect);

  const createResponder = useCallback((corner: Corner) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialCropRectRef.current = cropRect;
      },
      onPanResponderMove: (_, gestureState) => {
        let initial = initialCropRectRef.current;
        const { dx, dy } = gestureState;

        if (!initial || (gestureState.numberActiveTouches === 1 && (dx !== 0 || dy !== 0))) {
          initial = cropRect;
          initialCropRectRef.current = cropRect;
        }

        setCropRect(() => {
          let newX = initial.x;
          let newY = initial.y;
          let newW = initial.width;
          let newH = initial.height;
        
          switch (corner) {
            case 'topLeft':
              newX = initial.x + dx;
              newY = initial.y + dy;
              newW = initial.width - dx;
              newH = initial.height - dy;
              break;
            case 'topRight':
              newY = initial.y + dy;
              newW = initial.width + dx;
              newH = initial.height - dy;
              break;
            case 'bottomLeft':
              newX = initial.x + dx;
              newW = initial.width - dx;
              newH = initial.height + dy;
              break;
            case 'bottomRight':
              newW = initial.width + dx;
              newH = initial.height + dy;
              break;
          }
        
          // Ограничения по размерам
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newW < MIN_CROP_SIZE) newW = MIN_CROP_SIZE;
          if (newH < MIN_CROP_SIZE) newH = MIN_CROP_SIZE;
          if (newX + newW > containerSize.width) newW = containerSize.width - newX;
          if (newY + newH > containerSize.height) newH = containerSize.height - newY;
        
          return {
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newW),
            height: Math.round(newH),
          };
        });
      },
    });
  }, [cropRect, containerSize, setCropRect]);

  const panResponders = React.useMemo(() => ({
    topLeft: createResponder('topLeft'),
    topRight: createResponder('topRight'),
    bottomLeft: createResponder('bottomLeft'),
    bottomRight: createResponder('bottomRight'),
  }), [createResponder]);

  const renderCorner = (corner: Corner) => {
    const { x, y, width, height } = cropRect;
    const lineLength = CORNER_LINE_LENGTH;
    const lineWidth = CORNER_LINE_WIDTH;

    const lineStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor: '#000',
    };

    const wrapperStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (corner) {
      case 'topLeft':
        wrapperStyle.left = x - lineWidth;
        wrapperStyle.top = y - lineWidth;
        return (
          <View key={corner} {...panResponders[corner].panHandlers} style={wrapperStyle}>
            <View style={[lineStyle, { width: lineLength, height: lineWidth }]} />
            <View style={[lineStyle, { width: lineWidth, height: lineLength }]} />
          </View>
        );
      case 'topRight':
        wrapperStyle.left = x + width - lineLength + lineWidth;
        wrapperStyle.top = y - lineWidth;
        return (
          <View key={corner} {...panResponders[corner].panHandlers} style={wrapperStyle}>
            <View style={[lineStyle, { width: lineLength, height: lineWidth }]} />
            <View style={[lineStyle, { position: 'absolute', left: lineLength - lineWidth, width: lineWidth, height: lineLength }]} />
          </View>
        );
      case 'bottomLeft':
        wrapperStyle.left = x - lineWidth;
        wrapperStyle.top = y + height - lineLength + lineWidth;
        return (
          <View key={corner} {...panResponders[corner].panHandlers} style={wrapperStyle}>
            <View style={[lineStyle, { width: lineLength, height: lineWidth, top: lineLength - lineWidth }]} />
            <View style={[lineStyle, { width: lineWidth, height: lineLength }]} />
          </View>
        );
      case 'bottomRight':
        wrapperStyle.left = x + width - lineLength + lineWidth;
        wrapperStyle.top = y + height - lineLength + lineWidth;
        return (
          <View key={corner} {...panResponders[corner].panHandlers} style={wrapperStyle}>
            <View style={[lineStyle, { width: lineLength, height: lineWidth, top: lineLength - lineWidth }]} />
            <View style={[lineStyle, { position: 'absolute', left: lineLength - lineWidth, width: lineWidth, height: lineLength }]} />
          </View>
        );
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, { height: containerSize.height }]}>
      {/* Overlay */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {/* Mask */}
      <View style={[styles.cropMask, { left: 0, top: 0, right: 0, bottom: containerSize.height - cropRect.y }]} />
      <View style={[styles.cropMask, { left: 0, top: cropRect.y, width: cropRect.x, height: cropRect.height }]} />
      <View style={[styles.cropMask, { right: 0, top: cropRect.y, width: containerSize.width - (cropRect.x + cropRect.width), height: cropRect.height }]} />
      <View style={[styles.cropMask, { left: 0, top: cropRect.y + cropRect.height, right: 0, bottom: 0 }]} />

      {/* Frame */}
      <View style={{
        position: 'absolute',
        left: cropRect.x,
        top: cropRect.y,
        width: cropRect.width,
        height: cropRect.height,
        borderWidth: 2,
        borderColor: '#000',
      }} />

      {/* Corners */}
      {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as Corner[]).map(renderCorner)}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {},
  cropMask: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default CropFrameOverlay;