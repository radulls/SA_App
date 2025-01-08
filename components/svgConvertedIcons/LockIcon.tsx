import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet } from 'react-native';

const LockIcon = ({ width = 20, height = 22, fill = "white" }) => (
  <Svg width={width} height={height} viewBox="0 0 20 22" fill="none" style={styles.lock}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 10C0 7.79086 1.79086 6 4 6H5V5C5 2.23858 7.23858 0 10 0C12.7614 0 15 2.23858 15 5V6H13V5C13 3.34315 11.6569 2 10 2C8.34315 2 7 3.34315 7 5V6H16V8H4C2.89543 8 2 8.89543 2 10V18C2 19.1046 2.89543 20 4 20H10V17C9.44771 17 9 16.5523 9 16V14C9 13.4477 9.44771 13 10 13C10.5523 13 11 13.4477 11 14V16C11 16.5523 10.5523 17 10 17V20H16C17.1046 20 18 19.1046 18 18V10C18 8.89543 17.1046 8 16 8V6C18.2091 6 20 7.79086 20 10V18C20 20.2091 18.2091 22 16 22H4C1.79086 22 0 20.2091 0 18V10Z"
      fill={fill}
    />
  </Svg>
);

export default LockIcon;

const styles = StyleSheet.create({
  lock:{
    marginRight: 10,
  }
})