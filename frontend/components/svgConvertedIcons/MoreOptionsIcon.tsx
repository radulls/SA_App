import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MoreOptionsIcon = ({ width = 21, height = 5, fill = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 21 5" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5H8C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5H16C16 1.11929 17.1193 0 18.5 0C19.8807 0 21 1.11929 21 2.5C21 3.88071 19.8807 5 18.5 5C17.1193 5 16 3.88071 16 2.5H13C13 3.88071 11.8807 5 10.5 5C9.11929 5 8 3.88071 8 2.5H5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5Z"
      fill={fill}
    />
  </Svg>
);

export default MoreOptionsIcon;
