import React from 'react';
import Svg, { Path } from 'react-native-svg';

const DetailsIcon = ({ width = 22, height = 22 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C17.0751 0 22 4.92487 22 11H20C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20V16C10.4477 16 10 15.5523 10 15V9.46149C10 8.90921 10.4477 8.46149 11 8.46149V7.61144C10.4477 7.61144 10 7.16373 10 6.61144C10 6.05916 10.4477 5.61144 11 5.61144C11.5523 5.61144 12 6.05916 12 6.61144C12 7.16373 11.5523 7.61144 11 7.61144V8.46149C11.5523 8.46149 12 8.90921 12 9.46149V15C12 15.5523 11.5523 16 11 16V20C15.9706 20 20 15.9706 20 11H22C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0Z"
        fill="black"
      />
    </Svg>
  );
};

export default DetailsIcon;
