import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AddSubdivisionIcon = ({ width = 22, height = 22 }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 22H5C2.23858 22 0 19.7614 0 17V12H2V17C2 18.6569 3.34315 20 5 20H11C11.5523 20 12 20.4477 12 21L21 12C20.4477 12 20 11.5523 20 11V9H17V12C17.5523 12 18 12.4477 18 13V16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H18V21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21V18H13C12.4477 18 12 17.5523 12 17C12 16.4477 12.4477 16 13 16H16V13C16 12.4477 16.4477 12 17 12V9H20V5C20 3.34315 18.6569 2 17 2H5C3.34315 2 2 3.34315 2 5V12H0V5C0 2.23858 2.23858 0 5 0H17C19.7614 0 22 2.23858 22 5V11C22 11.5523 21.5523 12 21 12L12 21C12 21.5523 11.5523 22 11 22Z"
      fill="black"
    />
  </Svg>
);

export default AddSubdivisionIcon;
