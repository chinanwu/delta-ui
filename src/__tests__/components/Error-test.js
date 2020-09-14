import { shallow } from 'enzyme';
import React from 'react';

import { Error } from '../../components/Error.jsx';

jest.unmock('../../components/Error.jsx');

describe('Error component', () => {
	describe('rendering', () => {
		it('renders Error', () => {
			const wrapper = shallow(<Error />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});
});
