import React from 'react';
import Svg, { Path } from 'react-native-svg';

const NotificationIcon = ({ width = 22, height = 22, fill = "#A2A2A2" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 0h20a1 1 0 1 1 0 2v16a4 4 0 0 1-4 4h-6v-2h6a2 2 0 0 0 2-2V2h-8v3h4a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h4V2H3v16a2 2 0 0 0 2 2h6v2H5a4 4 0 0 1-4-4V2a1 1 0 1 1 0-2Z"
      fill={fill}
    />
  </Svg>
);

export default NotificationIcon;