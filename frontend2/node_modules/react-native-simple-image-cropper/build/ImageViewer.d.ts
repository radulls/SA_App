import { Component, ReactNode, RefObject } from 'react';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { IImageViewerData } from './types';
interface IProps {
    image: string;
    areaWidth: number;
    areaHeight: number;
    imageWidth: number;
    imageHeight: number;
    minScale: number;
    onMove: ({ positionX, positionY, scale }: IImageViewerData) => void;
    containerColor?: string;
    imageBackdropColor?: string;
    overlay?: ReactNode;
}
declare class ImageViewer extends Component<IProps> {
    pinchRef: RefObject<PinchGestureHandler>;
    dragRef: RefObject<PanGestureHandler>;
    translateX: Animated.Value<number>;
    translateY: Animated.Value<number>;
    scale: Animated.Value<number>;
    onTapGestureEvent: (...args: any[]) => void;
    onPanGestureEvent: (...args: any[]) => void;
    onPinchGestureEvent: (...args: any[]) => void;
    static defaultProps: {
        containerColor: string;
        imageBackdropColor: string;
    };
    constructor(props: IProps);
    handleMove: (args: readonly number[]) => void;
    render(): JSX.Element;
}
export default ImageViewer;
