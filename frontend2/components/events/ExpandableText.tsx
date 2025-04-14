import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity, LayoutChangeEvent } from 'react-native';

export const ExpandableText = ({
  text,
  numberOfLines = 4,
  textStyle,
  toggleStyle,
}: {
  text: string;
  numberOfLines?: number;
  textStyle?: any;
  toggleStyle?: any;
}) => {
  const [showFull, setShowFull] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);

  const handleFullLayout = (e: LayoutChangeEvent) => {
    setFullHeight(e.nativeEvent.layout.height);
  };

  const handleCollapsedLayout = (e: LayoutChangeEvent) => {
    setCollapsedHeight(e.nativeEvent.layout.height);
  };

  React.useEffect(() => {
    if (fullHeight && collapsedHeight && fullHeight > collapsedHeight) {
      setIsLong(true);
    }
  }, [fullHeight, collapsedHeight]);

  return (
    <View>
      {/* скрытый полный текст (для замера) */}
      <Text
        style={[textStyle, { position: 'absolute', opacity: 0, zIndex: -1, width: '100%' }]}
        onLayout={handleFullLayout}
      >
        {text}
      </Text>

      {/* скрытый урезанный текст (для замера) */}
      <Text
        style={[textStyle, { position: 'absolute', opacity: 0, zIndex: -1, width: '100%' }]}
        numberOfLines={numberOfLines}
        onLayout={handleCollapsedLayout}
      >
        {text}
      </Text>

      {/* отображаемый текст */}
      <Text style={textStyle} numberOfLines={showFull ? undefined : numberOfLines}>
        {text}
      </Text>

      {/* кнопка */}
      {isLong && (
        <TouchableOpacity onPress={() => setShowFull((prev) => !prev)}>
          <Text style={toggleStyle}>
            {showFull ? 'Скрыть' : 'Читать полностью'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
