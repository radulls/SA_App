import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CreatePostIcon = ({ width = 10, height = 15}) => (
  <Svg width={width} height={height} viewBox="0 0 10 15" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3.82381L2.07265 5.74916C1.66541 6.15598 0.999315 6.1347 0.618866 5.70271C0.270914 5.30762 0.289847 4.71015 0.662115 4.33788L4.28641 0.713588C4.68052 0.319484 5.31948 0.319485 5.71359 0.713589L9.33839 4.33839C9.71042 4.71042 9.72948 5.30746 9.38193 5.70245C9.00174 6.13455 8.33573 6.15606 7.92845 5.74939L6 3.82381L6 14C6 14.5523 5.55228 15 5 15C4.44772 15 4 14.5523 4 14L4 3.82381Z"
      fill='black'
    />
  </Svg>
);

export default CreatePostIcon;