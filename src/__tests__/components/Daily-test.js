import { shallow } from 'enzyme';
import React, { useEffect } from 'react';

import { Daily, mapStateToProps } from '../../components/Daily.jsx';

jest.unmock('../../components/Daily.jsx');

describe('Daily', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(<Daily />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Daily dark', () => {
			const wrapper = shallow(<Daily dark={true} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders Daily light', () => {
			const wrapper = shallow(<Daily dark={false} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	// describe('behaviour', () => {
	// 	it('sets the timer', () => {
	// useState
	// 	.mockReturnValueOnce(['#ffffff', setTest]);
	// const wrapper = shallow(<Daily />);
	// expect(wrapper.getElement()).toMatchSnapshot();
	// });
	// });

	describe('mapStateToProps', () => {
		it('returns mapped properties', () => {
			const theme = { dark: true };
			const state = { theme };
			expect(mapStateToProps(state)).toEqual(theme);
		});
	});
});
