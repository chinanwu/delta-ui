import { shallow } from 'enzyme';
import React from 'react';

import { Modal } from '../../components/Modal.jsx';
import { aBtn, escapeBtn } from '../../constants/Keycodes';

jest.unmock('../../components/Modal.jsx');
jest.unmock('../../functions/getThemeClassname');

describe('Modal component', () => {
	describe('rendering', () => {
		it('renders Modal', () => {
			const wrapper = shallow(<Modal />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders close button', () => {
			const wrapper = shallow(<Modal onClose={jest.fn()} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders additional styling', () => {
			const wrapper = shallow(<Modal contentClassname="Test" />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('closes Modal on click', () => {
			const onClose = jest.fn();
			const wrapper = shallow(<Modal onClose={onClose} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#modalClose').simulate('click');
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('closes Modal with escape key press', () => {
			const preventDefault = jest.fn();
			const event = {
				keyCode: escapeBtn,
				preventDefault,
			};
			const onClose = jest.fn();
			const wrapper = shallow(<Modal id="test" onClose={onClose} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('keydown', event);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(preventDefault).toHaveBeenCalledTimes(1);
		});

		it('does nothing other key press', () => {
			const event = {
				keyCode: aBtn,
			};
			const onClose = jest.fn();
			const wrapper = shallow(<Modal id="test" onClose={onClose} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('keydown', event);
			expect(onClose).not.toHaveBeenCalled();
		});

		it('does nothing with invalid event', () => {
			const onClose = jest.fn();
			const wrapper = shallow(<Modal id="test" onClose={onClose} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('keydown');
			expect(onClose).not.toHaveBeenCalled();
		});

		it('does nothing if key press but no close', () => {
			const wrapper = shallow(<Modal id="test" />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('keydown');
		});
	});
});
