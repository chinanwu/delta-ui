import { shallow } from 'enzyme';
import React from 'react';

import { NotFound, mapStateToProps } from '../../components/NotFound.jsx';

jest.unmock('../../components/NotFound.jsx');
jest.unmock('../../functions/getThemeClassname');

// mock the HOC
jest.mock('../../components/HOC/withTitle', () => () => Component => props => (
	<Component {...props} />
));

describe('NotFound component', () => {
	describe('rendering', () => {
		it('renders NotFound', () => {
			const wrapper = shallow(<NotFound />);
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
