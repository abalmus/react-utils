"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
exports.ChildrenUtils = __assign({}, react_1.Children, { 
    /**
     * Filter children
     * @param   {object} children - React component children
     * @param {function} filterFn - Array filter callback
     * @returns  {array}          - Filtered children
     */
    filter: function (children, filterFn) {
        return react_1.Children.toArray(children).filter(filterFn);
    },
    /**
     * Filter children and its children
     * @param   {object} children     - React component children
     * @param {function} deepFilterFn - Deep Filter callback
     */
    deepFilter: function (children, deepFilterFn) {
        var _this = this;
        return react_1.Children.toArray(children)
            .filter(deepFilterFn)
            .map(function (child) {
            if (child.props &&
                child.props.children &&
                typeof child.props.children === 'object') {
                // Clone the child that has children and filter them too
                return react_1.cloneElement(child, __assign({}, child.props, { children: _this.deepFilter(child.props.children, deepFilterFn) }));
            }
            return child;
        });
    },
    /**
     * Group children by type and puts in a rest key
     * the types not indicated
     * @param   {object} children - React component children
     * @param {string[]} types    - Array of child types
     * @param   {string} rest     - Object key name where non types will be saved
     * @returns {object}          - Map of the types and rest
     */
    groupByType: function (children, types, rest) {
        return react_1.Children.toArray(children).reduce(function (group, child) {
            var _a;
            var isGrouped = lodash_1.includes(types, child.type);
            var addChild = isGrouped ? child.props.children : child;
            var key = isGrouped ? child.type : rest;
            return __assign({}, group, (_a = {}, _a[key] = (group[key] || []).concat([addChild]), _a));
        }, {});
    },
    /**
     * Map children and its children
     * @param   {object} children  - React component children
     * @param {function} deepMapFn - Deep Map callback
     * @returns  {array}           - Deep Mapped children
     */
    deepMap: function (children, deepMapFn) {
        var _this = this;
        return react_1.Children.map(children, function (child) {
            if (child.props &&
                child.props.children &&
                typeof child.props.children === 'object') {
                // Clone the child that has children and map them too
                return deepMapFn(react_1.cloneElement(child, __assign({}, child.props, { children: _this.deepMap(child.props.children, deepMapFn) })));
            }
            return deepMapFn(child);
        });
    },
    /**
     * ForEach children and its children
     * @param   {object} children      - React component children
     * @param {function} deepForEachFn - Deep Map callback
     */
    deepForEach: function (children, deepForEachFn) {
        var _this = this;
        react_1.Children.forEach(children, function (child) {
            if (child.props &&
                child.props.children &&
                typeof child.props.children === 'object') {
                // Each inside the child that has children
                _this.deepForEach(child.props.children, deepForEachFn);
            }
            deepForEachFn(child);
        });
    },
    /**
     * Find in children and its children
     * @param   {object} children   - React component children
     * @param {function} deepFindFn - Deep Map callback
     * @returns  {array}            - Children found
     */
    deepFind: function (children, deepFindFn) {
        var _this = this;
        return react_1.Children.toArray(children).find(function (child) {
            if (child.props &&
                child.props.children &&
                typeof child.props.children === 'object') {
                // Find inside the child that has children
                return _this.deepFind(child.props.children, deepFindFn);
            }
            return deepFindFn(child);
        });
    },
    /**
     * Get only the text in children and its children
     * @param   {object} children - React component children
     * @returns  {string}         - Text of all children
     */
    onlyText: function (children) {
        var _this = this;
        return react_1.Children.toArray(children)
            .reduce(function (flattened, child) { return flattened.concat([
            child.props && child.props.children
                ? _this.onlyText(child.props.children)
                : child
        ]); }, [])
            .join('');
    } });
