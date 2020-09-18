import { shallow } from 'enzyme';
import React, { useEffect, useRef } from 'react';

import { History, mapStateToProps } from '../../components/History.jsx';

jest.unmock('../../components/History.jsx');
jest.unmock('../../functions/getThemeClassname');

// mock the HOC
jest.mock('../../components/HOC/withTitle', () => () => Component => props => (
	<Component {...props} />
));

describe('History component', () => {
	describe('rendering', () => {
		it('renders History', () => {
			const ref = { current: { scrollIntoView: jest.fn() } };
			useRef.mockReturnValue(ref);
			const wrapper = shallow(<History history={['test']} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders hidden scrollbar when win', () => {
			const wrapper = shallow(<History history={['test']} win={true} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders hints', () => {
			const wrapper = shallow(
				<History
					history={['test']}
					hintWord="from"
					hintNumLeft={3}
					showHint={true}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders hint when it is to', () => {
			const wrapper = shallow(
				<History
					history={['test']}
					to="from"
					hintWord="from"
					hintNumLeft={1}
					showHint={true}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('mapStateToProps', () => {
		it('returned mapped properties', () => {
			const theme = { dark: true };
			const state = { theme };
			expect(mapStateToProps(state)).toEqual(theme);
		});
	});
});
