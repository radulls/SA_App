"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var Clock = react_native_reanimated_1.default.Clock, Value = react_native_reanimated_1.default.Value, block = react_native_reanimated_1.default.block, cond = react_native_reanimated_1.default.cond, stopClock = react_native_reanimated_1.default.stopClock, set = react_native_reanimated_1.default.set, startClock = react_native_reanimated_1.default.startClock, clockRunning = react_native_reanimated_1.default.clockRunning, not = react_native_reanimated_1.default.not, reTiming = react_native_reanimated_1.default.timing;
var animate = function (_a) {
    var fn = _a.fn, clock = _a.clock, state = _a.state, config = _a.config, from = _a.from;
    return block([
        cond(not(clockRunning(clock)), [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, from),
            startClock(clock),
        ]),
        fn(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
    ]);
};
var timing = function (params) {
    var _a = __assign({ clock: new Clock(), duration: 250, from: 0, to: 1, easing: function (v) { return react_native_reanimated_1.add(v, 0); } }, params), clock = _a.clock, easing = _a.easing, duration = _a.duration, from = _a.from, to = _a.to;
    var state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };
    var config = {
        toValue: new Value(0),
        duration: duration,
        easing: easing,
    };
    return block([
        cond(not(clockRunning(clock)), [
            set(config.toValue, to),
            set(state.frameTime, 0),
        ]),
        animate({
            clock: clock,
            fn: reTiming,
            state: state,
            config: config,
            from: from,
        }),
    ]);
};
exports.timing = timing;
