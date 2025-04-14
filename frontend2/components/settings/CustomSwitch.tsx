import React from 'react';
import { Switch } from 'react-native-switch';

type CustomSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => (
  <Switch
    value={value}
    onValueChange={onValueChange}
    activeText=""
    inActiveText=""
    circleSize={18}
    barHeight={22}
    circleBorderWidth={0}
    backgroundActive="#000"
    backgroundInactive="#e5e5e5"
    circleActiveColor="#fff"
    circleInActiveColor="#fff"
    switchWidthMultiplier={2.2}
    changeValueImmediately={true}
    innerCircleStyle={{ elevation: 2 }}
    renderActiveText={false}
    renderInActiveText={false}
  />
);

export default CustomSwitch;
