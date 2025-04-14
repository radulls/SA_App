import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const CheckIcon = ({ width = 22, height = 22 }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <Rect x="6" y="4" width="10" height="2" rx="1" fill="white"/>
    <Rect x="6" y="8" width="8" height="2" rx="1" fill="white"/>
    <Rect x="6" y="12" width="5" height="2" rx="1" fill="white"/>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1C0 0.447715 0.447715 0 1 0H21C21.5523 0 22 0.447715 22 1C22 1.55228 21.5523 2 21 2V14H19V2H3V18.5V19C3 19.5523 3.44772 20 4 20C4.55228 20 5 19.5523 5 19V18.5C5 17.1193 6.11929 16 7.5 16C8.88071 16 10 17.1193 10 18.5V19C10 19.5523 10.4477 20 11 20C11.5523 20 12 19.5523 12 19V18.5C12 17.1193 13.1193 16 14.5 16C15.8807 16 17 17.1193 17 18.5V19C17 19.5523 17.4477 20 18 20C18.5523 20 19 19.5523 19 19V14H21V19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19V18.5C15 18.2239 14.7761 18 14.5 18C14.2239 18 14 18.2239 14 18.5V19C14 20.6569 12.6569 22 11 22C9.34315 22 8 20.6569 8 19V18.5C8 18.2239 7.77614 18 7.5 18C7.22386 18 7 18.2239 7 18.5V19C7 20.6569 5.65685 22 4 22C2.34315 22 1 20.6569 1 19V2C0.447715 2 0 1.55228 0 1Z"
      fill="white"
    />
  </Svg>
);

export default CheckIcon;
