import React from 'react';
import Svg, { Path } from 'react-native-svg';

const NotificationIcon = ({ width = 22, height = 23, fill = "#A2A2A2" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 23" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1.38C0 0.893989 0.393989 0.5 0.88 0.5H21C21.5523 0.5 22 0.947715 22 1.5C22 2.05228 21.5523 2.5 21 2.5V18.5C21 20.7091 19.2091 22.5 17 22.5H11V20.5H17C18.1046 20.5 19 19.6046 19 18.5V2.5H11V5.5H15C15.5523 5.5 16 5.94772 16 6.5C16 7.05228 15.5523 7.5 15 7.5H7C6.44772 7.5 6 7.05228 6 6.5C6 5.94772 6.44772 5.5 7 5.5H11V2.5H3V18.5C3 19.6046 3.89543 20.5 5 20.5H11V22.5H5C2.79086 22.5 1 20.7091 1 18.5V2.5C0.447715 2.5 0 2.05228 0 1.5V1.38Z"
      fill={fill}
    />
  </Svg>
);

export default NotificationIcon;