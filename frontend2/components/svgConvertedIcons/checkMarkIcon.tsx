import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckMarkIcon = ({ width = 11, height = 9, fill = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 11 9" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.707107 4.77742C0.316583 4.3869 0.316582 3.75373 0.707107 3.36321C1.09763 2.97268 1.7308 2.97268 2.12132 3.36321L4.20591 5.44779C4.22619 5.46808 4.25909 5.46808 4.27937 5.44779L9.19239 0.534779C9.58291 0.144254 10.2161 0.144254 10.6066 0.534779C10.9971 0.925303 10.9971 1.55847 10.6066 1.94899L4.29774 8.25785C4.26731 8.28828 4.21797 8.28828 4.18754 8.25785L0.707107 4.77742Z"
      fill={fill}
    />
  </Svg>
);

export default CheckMarkIcon;
