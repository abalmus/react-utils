"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var classNames = require("classnames");
exports.classNames = classNames;
function variationName(name, value) {
    var valuePortion = typeof value === 'number'
        ? String(value)
        : "" + value[0].toUpperCase() + value.substring(1);
    return "" + name + valuePortion;
}
exports.variationName = variationName;
