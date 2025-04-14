import React from 'react';
import Svg, { Path } from 'react-native-svg';

const IconArrowSettings = ({ width = 7, height = 11, fill = "black" }) => (
  <Svg width={width} height={height} viewBox="0 0 7 11" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.949632 10.6064C0.559107 10.2158 0.559107 9.58268 0.949632 9.19216L3.77806 6.36373C4.16858 5.9732 4.16858 5.34004 3.77806 4.94952L0.949632 2.12109C0.559107 1.73056 0.559107 1.0974 0.949632 0.706875C1.34016 0.316351 1.97332 0.31635 2.36385 0.706875L6.60649 4.94952C6.99701 5.34004 6.99701 5.9732 6.60649 6.36373L2.36385 10.6064C1.97332 10.9969 1.34016 10.9969 0.949632 10.6064Z"
      fill={fill}
    />
  </Svg>
);

export default IconArrowSettings;