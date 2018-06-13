import { Children, cloneElement, ReactNode } from 'react';
import { includes } from 'lodash';

export const ChildrenUtils = {
    ...Children,

    /**
     * Filter children
     * @param   {object} children - React component children
     * @param {function} filterFn - Array filter callback
     * @returns  {array}          - Filtered children
     */
    filter(children: React.ReactNode, filterFn) {
        return Children.toArray(children).filter(filterFn);
    },

    /**
     * Filter children and its children
     * @param   {object} children     - React component children
     * @param {function} deepFilterFn - Deep Filter callback
     */
    deepFilter(children: ReactNode, deepFilterFn) {
        return Children.toArray(children)
            .filter(deepFilterFn)
            .map((child: any) => {
                if (
                    child.props &&
                    child.props.children &&
                    typeof child.props.children === 'object'
                ) {
                    // Clone the child that has children and filter them too
                    return cloneElement(child, {
                        ...child.props,
                        children: this.deepFilter(child.props.children, deepFilterFn)
                    });
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
    groupByType(children: React.ReactNode, types, rest) {
        return Children.toArray(children).reduce((group, child: any) => {
            const isGrouped = includes(types, child.type);
            const addChild = isGrouped ? child.props.children : child;
            const key = isGrouped ? child.type : rest;

            return {
                ...group,
                [key]: [...(group[key] || []), addChild]
            };
        }, {});
    },

    /**
     * Map children and its children
     * @param   {object} children  - React component children
     * @param {function} deepMapFn - Deep Map callback
     * @returns  {array}           - Deep Mapped children
     */
    deepMap(children: React.ReactNode, deepMapFn) {
        return Children.map(children, (child: any) => {
            if (
                child.props &&
                child.props.children &&
                typeof child.props.children === 'object'
            ) {
                // Clone the child that has children and map them too
                return deepMapFn(
                    cloneElement(child, {
                        ...child.props,
                        children: this.deepMap(child.props.children, deepMapFn)
                    })
                );
            }
            return deepMapFn(child);
        });
    },

    /**
     * ForEach children and its children
     * @param   {object} children      - React component children
     * @param {function} deepForEachFn - Deep Map callback
     */
    deepForEach(children, deepForEachFn) {
        Children.forEach(children, (child: any) => {
            if (
                child.props &&
                child.props.children &&
                typeof child.props.children === 'object'
            ) {
                // Each inside the child that has children
                this.deepForEach(child.props.children, deepForEachFn);
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
    deepFind(children, deepFindFn) {
        return Children.toArray(children).find((child: any) => {
            if (
                child.props &&
                child.props.children &&
                typeof child.props.children === 'object'
            ) {
                // Find inside the child that has children
                return this.deepFind(child.props.children, deepFindFn);
            }
            return deepFindFn(child);
        });
    },

    /**
     * Get only the text in children and its children
     * @param   {object} children - React component children
     * @returns  {string}         - Text of all children
     */
    onlyText(children) {
        return Children.toArray(children)
            .reduce(
                (flattened, child: any) => [
                    ...flattened,
                    child.props && child.props.children
                        ? this.onlyText(child.props.children)
                        : child
                ],
                []
            )
            .join('');
    }
};
