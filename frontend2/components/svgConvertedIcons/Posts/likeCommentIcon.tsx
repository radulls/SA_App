import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LikeCommentIcon = ({ width = 13, height = 12, fill = "black" }) => (
  <Svg width={width} height={height} viewBox="0 0 13 12" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.13434 2.28445L6.5 2.48864L6.86566 2.28445L7.93304 1.68842C9.86746 0.608234 12.25 2.00664 12.25 4.22222L12.25 4.41752C12.25 5.39575 11.8284 6.32653 11.0932 6.97173L6.5 11.0022L1.90685 6.97173C1.17157 6.32653 0.75 5.39575 0.75 4.41752V4.22222C0.75 2.00664 3.13254 0.608234 5.06696 1.68842L6.13434 2.28445Z"
      fill={fill}
      strokeWidth={1.5}
    />
  </Svg>
);

export default LikeCommentIcon;
