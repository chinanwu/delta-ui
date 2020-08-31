import { shallow } from 'enzyme';
import React from 'react';

import { Loading } from '../../components/Loading.jsx';

jest.unmock('../../components/Loading.jsx');

describe('Loading component', () => {
	describe('rendering', () => {
		it('renders Loading', () => {
			const wrapper = shallow(<Loading />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});
});
