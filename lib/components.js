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
var React = require("react");
var react_dom_1 = require("react-dom");
var target_1 = require("./target");
var isValidElement = React.isValidElement, Children = React.Children;
function FirstChild(props) {
    var childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
}
exports.FirstChild = FirstChild;
function getDisplayName(Component) {
    return (Component.displayName ||
        Component.name ||
        'Component');
}
exports.getDisplayName = getDisplayName;
/*
* Wraps `element` in `Component`, if it is not already an instance of
* `Component`. If `props` is passed, those will be added as props on the
* wrapped component. If `element` is null, the component is not wrapped.
*/
function wrapWithComponent(element, Component, props) {
    if (element == null) {
        return null;
    }
    return isElementOfType(element, Component) ? (element) : (React.createElement(Component, __assign({}, props), element));
}
exports.wrapWithComponent = wrapWithComponent;
function hotReloadComponentCheck(AComponent, AnotherComponent) {
    var componentName = AComponent.name;
    var anotherComponentName = AnotherComponent.name;
    return (AComponent === AnotherComponent ||
        (Boolean(componentName) && componentName === anotherComponentName));
}
/*
* In development, we compare based on the name of the function because
* React Hot Loader proxies React components in order to make updates. In
* production we can simply compare the components for equality.
*/
var isComponent = process.env.NODE_ENV === 'development'
    ? hotReloadComponentCheck
    : function (AComponent, AnotherComponent) { return AComponent === AnotherComponent; };
/*
* Checks whether `element` is a React element of type `Component` (or one of
* the passed components, if `Component` is an array of React components).
*/
function isElementOfType(element, Component) {
    if (element == null ||
        !isValidElement(element) ||
        typeof element.type === 'string') {
        return false;
    }
    var type = element.type;
    var Components = Array.isArray(Component) ? Component : [Component];
    return Components.some(function (AComponent) { return typeof type !== 'string' && isComponent(AComponent, type); });
}
exports.isElementOfType = isElementOfType;
/*
* Returns all children that are valid elements as an array. Can optionally be
* filtered by passing `predicate`.
*/
function elementChildren(children, predicate) {
    if (predicate === void 0) { predicate = function () { return true; }; }
    return Children.toArray(children).filter(function (child) { return isValidElement(child) && predicate(child); });
}
exports.elementChildren = elementChildren;
/*
* Adds the `methods` to the prototype of `Component`, with any existing
* methods of the same name still being called *after* they version supplied
* by `methods`. Returns the newly-augmented class.
*/
function augmentComponent(Component, methods) {
    Object.keys(methods).forEach(function (name) {
        var method = methods[name];
        if (typeof method !== 'function') {
            return;
        }
        var currentMethod = Component.prototype[name];
        Component.prototype[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // tslint:disable-next-line no-invalid-this
            if (typeof currentMethod === 'function') {
                currentMethod.call.apply(currentMethod, [this].concat(args));
            }
            // tslint:disable-next-line no-invalid-this
            method.call.apply(method, [this].concat(args));
        };
    });
    return Component;
}
exports.augmentComponent = augmentComponent;
var layerIndex = 1;
function layeredComponent(options) {
    if (options === void 0) { options = {}; }
    function uniqueID() {
        var idPrefix = options.idPrefix;
        return idPrefix + "Layer" + layerIndex++;
    }
    return function createLayeredComponent(Component) {
        return augmentComponent(Component, {
            componentWillMount: function () {
                if (target_1.isServer) {
                    return;
                }
                var node = document.createElement('div');
                node.id = uniqueID();
                // tslint:disable-next-line no-invalid-this
                this.layerNode = node;
            },
            componentDidMount: function () {
                if (target_1.isServer) {
                    return;
                }
                // tslint:disable-next-line no-invalid-this
                document.body.appendChild(this.layerNode);
                // tslint:disable-next-line no-invalid-this
                this.renderLayerToNode();
            },
            componentDidUpdate: function () {
                if (target_1.isServer) {
                    return;
                }
                // tslint:disable-next-line no-invalid-this
                this.renderLayerToNode();
            },
            renderLayerToNode: function () {
                if (target_1.isServer) {
                    return;
                }
                /* tslint:disable no-invalid-this */
                var layerOutput = this.renderLayer() || React.createElement("span", null);
                this.layerOutput = layerOutput;
                react_dom_1.unstable_renderSubtreeIntoContainer(this, layerOutput, this.layerNode);
                /* tslint:enable no-invalid-this */
            },
            componentWillUnmount: function () {
                if (target_1.isServer) {
                    return;
                }
                // tslint:disable-next-line no-invalid-this
                var layerNode = this.layerNode;
                var parent = layerNode.parent;
                react_dom_1.unmountComponentAtNode(layerNode);
                if (parent) {
                    parent.removeChild(layerNode);
                }
            }
        });
    };
}
exports.layeredComponent = layeredComponent;
