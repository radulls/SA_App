import React from 'react';
import Svg, { Path } from 'react-native-svg';

const DeleteAdressIcon = ({ width = 16, height = 16 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">  
      <Path
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="#B4B4B4"
      />
       <Path
        d="M10.1214 11.5255C10.5119 11.916 11.145 11.916 11.5356 11.5255C11.9261 11.1349 11.9261 10.5018 11.5356 10.1113L5.87871 4.4544C5.48819 4.06387 4.85503 4.06387 4.4645 4.4544C4.07398 4.84492 4.07398 5.47809 4.4645 5.86861L10.1214 11.5255Z"
        fill="white"
      />
        <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.51469 11.5761C4.12417 11.1856 4.12417 10.5524 4.51469 10.1619L10.1715 4.50503C10.5621 4.1145 11.1952 4.1145 11.5858 4.50503C11.9763 4.89555 11.9763 5.52872 11.5858 5.91924L5.92891 11.5761C5.53838 11.9666 4.90522 11.9666 4.51469 11.5761Z"
        fill="white"
      />
    </Svg>
  );
};

export default DeleteAdressIcon;
