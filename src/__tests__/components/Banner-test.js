import { shallow } from 'enzyme';
import React from 'react';

import { Banner } from '../../components/Banner.jsx';

jest.unmock('../../components/Banner.jsx');

describe('Banner component', () => {
	describe('rendering', () => {
		it('renders Banner', () => {
			const wrapper = shallow(<Banner />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});
});
