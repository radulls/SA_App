import Animated from 'react-native-reanimated';
export interface ITimingParams {
    clock?: Animated.Clock;
    from?: Animated.Adaptable<number>;
    to?: Animated.Adaptable<number>;
    duration?: Animated.Adaptable<number>;
    easing?: (v: Animated.Adaptable<number>) => Animated.Node<number>;
}
declare const timing: (params: ITimingParams) => Animated.Node<number>;
export { timing };
