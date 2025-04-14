import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CopyCodeIcon = ({ width = 22, height = 22, fill = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8C0 5.79086 1.79086 4 4 4C4 1.79086 5.79086 0 8 0L18 0C20.2091 0 22 1.79086 22 4V14C22 16.2091 20.2091 18 18 18V16C19.1046 16 20 15.1046 20 14V4C20 2.89543 19.1046 2 18 2H8C6.89543 2 6 2.89543 6 4H14C16.2091 4 18 5.79086 18 8V18C18 20.2091 16.2091 22 14 22H9V20H14C15.1046 20 16 19.1046 16 18V8C16 6.89543 15.1046 6 14 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H9V22H4C1.79086 22 0 20.2091 0 18V8Z"
      fill={fill}
    />
  </Svg>
);

export default CopyCodeIcon;