"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPercentFromNumber = function (percent, numberFrom) {
    return (numberFrom / 100) * percent;
};
exports.getPercentFromNumber = getPercentFromNumber;
var getPercentDiffNumberFromNumber = function (number, numberFrom) { return (number / numberFrom) * 100; };
exports.getPercentDiffNumberFromNumber = getPercentDiffNumberFromNumber;
