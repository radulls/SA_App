import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AddIcon = ({ width = 22, height = 23, fill = "#A2A2A2" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 23" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1.5C10 0.947715 10.4477 0.5 11 0.5C11.5523 0.5 12 0.947715 12 1.5V10.5H21C21.5523 10.5 22 10.9477 22 11.5C22 12.0523 21.5523 12.5 21 12.5H12V21.5C12 22.0523 11.5523 22.5 11 22.5C10.4477 22.5 10 22.0523 10 21.5V12.5H1C0.447715 12.5 0 12.0523 0 11.5C0 10.9477 0.447715 10.5 1 10.5H10V1.5Z"
      fill={fill}
    />
  </Svg>
);

export default AddIcon;