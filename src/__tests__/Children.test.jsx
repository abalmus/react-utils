import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai, { expect, assert } from 'chai';

import 'mocha';

import { ChildrenUtils as Children } from '../children';

Enzyme.configure({ adapter: new Adapter() });

describe('Children', () => {
    it('should filter children items', () => {
        const Filtered = props => (
            <div>
                {Children.filter(props.children, item => item.type === 'span')}
            </div>
        );

        Filtered.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <Filtered>
                <span>1</span>
                <span>2</span>
                <strong>3</strong>
            </Filtered>
        );

        expect(wrapper.contains(<span>1</span>)).to.equal(true);
        expect(wrapper.find('span').length).to.equal(2);
        expect(wrapper.find('strong').length).to.equal(0);
    });

    it('should do deep filter', () => {
        const DeepFiltered = props => (
            <div>
                {
                    Children.deepFilter(props.children, item => item.type === 'span')
                }
            </div>
        );

        DeepFiltered.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <DeepFiltered>
                <span>1</span>
                <span>2</span>
                <span>
                    <strong>3</strong>
                    <span>
                        <strong>4</strong>
                        <span>5</span>
                    </span>
                </span>
            </DeepFiltered>,
        );

        expect(wrapper.contains(<span>1</span>)).to.equal(true);
        expect(wrapper.find('span').length).to.equal(5);
        expect(wrapper.find('strong').length).to.equal(0);
    });

    it('should group by type', () => {
        const Grouped = props => (
            <div>
                <div className="spans">{Children.groupByType(props.children, ['span', 'i'], 'rest').span}</div>
                <div className="rest">{Children.groupByType(props.children, ['span', 'i'], 'rest').rest}</div>
                <div className="empty">{Children.groupByType(props.children, ['span', 'i'], 'rest').i}</div>
            </div>
        );

        Grouped.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <Grouped>
                <span>
                    <b>1</b>
                </span>
                <span>
                    <b>2</b>
                </span>
                <strong>3</strong>
            </Grouped>,
        );

        expect(wrapper.contains(<div className="spans"><b>1</b><b>2</b></div>)).to.equal(true);
        expect(wrapper.contains(<div className="rest"><strong>3</strong></div>)).to.equal(true);
        expect(wrapper.contains(<div className="empty"></div>)).to.equal(true);
        expect(wrapper.find('.spans b').length).to.equal(2);
        expect(wrapper.find('.rest strong').length).to.equal(1);
        expect(wrapper.find('.empty').children()).to.have.length(0);
    });

    it('should be able to do deep map', () => {
        const DeepMapped = props => (
            <div>
                {
                    Children.deepMap(props.children,
                        child => (
                            child.type === 'b'
                                ? cloneElement(child, { ...child.props, className: 'mapped' })
                                : child
                        ),
                    )
                }
            </div>
        );

        DeepMapped.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <DeepMapped>
                <b>1</b>
                <b>2</b>
                <span>
                    <b>3</b>
                </span>
                <div>
                    <div><b>4</b></div>
                </div>
            </DeepMapped>,
        );

        expect(wrapper.find('.mapped').length).to.equal(4);
    });

    it('should be able to do deep each', () => {
        const texts = [];
        const DeepForEached = props => (
            <div>
                {
                    Children.deepForEach(props.children, (child) => {
                        if (child.type === 'b') {
                            texts.push(child.props.children);
                        }
                    })
                }
            </div>
        );

        DeepForEached.propTypes = { children: PropTypes.node.isRequired };

        shallow(
            <DeepForEached>
                <b>1</b>
                <b>2</b>
                <span>
                    <b>3</b>
                </span>
                <div>
                    <div>
                        <b>4</b>
                    </div>
                </div>
            </DeepForEached>,
        );
        expect(texts.join('')).to.equal('1234');
    });

    it('should be able to do deep find', () => {
        const DeepFound = props => (
            <div>
                {
                    Children.deepFind(props.children, child => child.type === 'i')
                }
            </div>
        );

        DeepFound.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <DeepFound>
                <b>1</b>
                <b>2</b>
                <span><i>3</i></span>
                <i>4</i>
            </DeepFound>
        );

        expect(wrapper.contains(<span><i>3</i></span>)).to.equal(true);
    });

    it('should be able to render only children content', () => {
        const OnlyText = props => (
            <div>{Children.onlyText(props.children)}</div>
        );

        OnlyText.propTypes = { children: PropTypes.node.isRequired };

        const wrapper = shallow(
            <OnlyText>
                <span>0</span>
                <b>1</b>
                <span><i>2</i></span>
                <i>3</i>
            </OnlyText>,
        );

        expect(wrapper.find('i').length).to.equal(0)
        expect(wrapper.find('b').length).to.equal(0)
        expect(wrapper.find('span').length).to.equal(0)
        expect(wrapper.text()).to.equal('0123');
    });
});
