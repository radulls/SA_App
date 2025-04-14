import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CropVideoIcon = ({ width = 22, height = 22}) => {
  return ( 
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 11C22 11.5523 21.5523 12 21 12C20.4477 12 20 11.5523 20 11L20 4C20 2.89543 19.1046 2 18 2H12V4H14C16.2091 4 18 5.79086 18 8V16H16V8C16 6.89543 15.1046 6 14 6L6 6V14C6 15.1046 6.89543 16 8 16L21 16C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H18V21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21V18H8C5.79086 18 4 16.2091 4 14L4 6H1C0.447716 6 0 5.55228 0 5C0 4.44772 0.447716 4 1 4H4V1C4 0.447716 4.44772 0 5 0C5.55228 0 6 0.447716 6 1V4L12 4V2H11C10.4477 2 10 1.55228 10 1C10 0.447716 10.4477 0 11 0H18C20.2091 0 22 1.79086 22 4L22 11Z"
        fill='black'
      />
    </Svg>
  );
};

export default CropVideoIcon;