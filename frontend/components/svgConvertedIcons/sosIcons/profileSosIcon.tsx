import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ProfileSosIcon = ({ width = 12, height = 12 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.60667 2.6561H5.13179C4.54601 2.6561 4.07113 2.18123 4.07113 1.59544C4.07113 1.00965 4.54601 0.534779 5.13179 0.534779H11.0334C11.0935 0.534779 11.1422 0.583484 11.1422 0.643564V6.54519C11.1422 7.13097 10.6673 7.60585 10.0815 7.60585C9.49575 7.60585 9.02088 7.13097 9.02088 6.54519V4.07031L1.94981 11.1414C1.55929 11.5319 0.926123 11.5319 0.535599 11.1414C0.145075 10.7509 0.145075 10.1177 0.535599 9.72717L7.60667 2.6561Z"
        fill="white"
      />
    </Svg>
  );
};

export default ProfileSosIcon;
