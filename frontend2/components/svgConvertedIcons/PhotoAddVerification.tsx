import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PhotoAddVerification = ({ width = 22, height = 22, fill = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 4C0 1.79086 1.79086 0 4 0H5H6C6.55228 0 7 0.447715 7 1H15C15 0.447715 15.4477 0 16 0H17H18C20.2091 0 22 1.79086 22 4V18C22 20.2091 20.2091 22 18 22H16C15.4477 22 15 21.5523 15 21C15 20.4477 15.4477 20 16 20H18C19.1046 20 20 19.1046 20 18V4C20 2.89543 19.1046 2 18 2H17H16C15.4477 2 15 1.55228 15 1H7C7 1.55228 6.55228 2 6 2H5H4C2.89543 2 2 2.89543 2 4V18C2 19.1046 2.89543 20 4 20H6C6.55228 20 7 20.4477 7 21C7 21.5523 6.55228 22 6 22H4C1.79086 22 0 20.2091 0 18V4Z"
      fill={fill}
    />
  </Svg>
);

export default PhotoAddVerification;
