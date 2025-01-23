import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

const IconBack = ({ width = 14, height = 14, fill = "white", onPress }: { width?: number; height?: number; fill?: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Svg width={width} height={height} viewBox="0 0 8 14" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.29289 0.635818C6.68342 0.245294 7.31658 0.245293 7.70711 0.635818C8.09763 1.02634 8.09709 1.66005 7.70657 2.05057C6.14511 3.61203 5.0355 4.72164 3.4762 6.28094C3.07948 6.67766 3.07897 7.32139 3.47569 7.71811L7.70711 11.9495C8.09763 12.34 8.09763 12.9732 7.70711 13.3637C7.31658 13.7543 6.68342 13.7543 6.29289 13.3637L0.624447 7.69529C0.240325 7.31117 0.240325 6.68839 0.624447 6.30426L6.29289 0.635818Z"
        fill={fill}
      />
    </Svg>
  </TouchableOpacity>
);

IconBack.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    zIndex: 100
  }
})

export default IconBack;
