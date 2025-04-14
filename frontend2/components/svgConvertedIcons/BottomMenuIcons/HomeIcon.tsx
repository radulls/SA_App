import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeIcon = ({ width = 22, height = 22, fill = "#A2A2A2" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.988 0c.441 0 .87.148 1.218.42l8.257 6.451A4 4 0 0 1 22 10.023V15h-2v-4.964a2 2 0 0 0-.765-1.573L11.618 2.48a1 1 0 0 0-1.236 0L2.765 8.463A2 2 0 0 0 2 10.036V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3h2v3a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-7.98a4 4 0 0 1 1.533-3.149L9.77.421C10.117.147 10.546 0 10.988 0Z"
      fill={fill}
    />
  </Svg>
);

export default HomeIcon;