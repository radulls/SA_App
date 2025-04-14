import React from 'react';
import Svg, { Path } from 'react-native-svg';

const DataIcon = ({ width = 22, height = 22, fill = "#999990" }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Path
      d="M0 5C0 2.79086 1.79086 1 4 1H5C5 0.447715 5.44772 0 6 0C6.55228 0 7 0.447715 7 1H11V3H7C7 3.55228 6.55228 4 6 4C5.44772 4 5 3.55228 5 3H4C2.89543 3 2 3.89543 2 5V8H20V10H2V18C2 19.1046 2.89543 20 4 20H18C19.1046 20 20 19.1046 20 18V5C20 3.89543 19.1046 3 18 3H17C17 3.55228 16.5523 4 16 4C15.4477 4 15 3.55228 15 3H11V1H15C15 0.447715 15.4477 0 16 0C16.5523 0 17 0.447715 17 1H18C20.2091 1 22 2.79086 22 5V18C22 20.2091 20.2091 22 18 22H4C1.79086 22 0 20.2091 0 18V5Z"
      fill={fill}
    />
  </Svg>
);

export default DataIcon;
