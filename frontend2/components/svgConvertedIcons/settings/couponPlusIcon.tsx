import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CouponPlusIcon = ({ width = 22, height = 22 }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0.999999C10 0.447715 10.4477 0 11 0C11.5523 0 12 0.447716 12 1L12 10H21C21.5523 10 22 10.4477 22 11C22 11.5523 21.5523 12 21 12H12L12 21C12 21.5523 11.5523 22 11 22C10.4477 22 10 21.5523 10 21V12H1C0.447716 12 0 11.5523 0 11C0 10.4477 0.447715 10 1 10H10V0.999999Z"
      fill="black"
    />
  </Svg>
);

export default CouponPlusIcon;
