import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TimeIcon = ({ width = 22, height = 22, fill = "#999990" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      d="M0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22V20C15.9706 20 20 15.9706 20 11H16C16 11.5523 15.5523 12 15 12H12C10.8954 12 10 11.1046 10 10V5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V9C12 9.55228 12.4477 10 13 10H15C15.5523 10 16 10.4477 16 11H20C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20V22C4.92487 22 0 17.0751 0 11Z"
      fill={fill}
    />
  </Svg>
);

export default TimeIcon;
