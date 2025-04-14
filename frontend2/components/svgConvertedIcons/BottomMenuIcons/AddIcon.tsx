import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AddIcon = ({ width = 22, height = 22, fill = "#A2A2A2" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 0a1 1 0 0 1 1 1v9h9a1 1 0 1 1 0 2h-9v9a1 1 0 1 1-2 0v-9H1a1 1 0 1 1 0-2h9V1a1 1 0 0 1 1-1Z"
      fill={fill}
    />
  </Svg>
);

export default AddIcon;