import { shallow } from 'enzyme';
import React from 'react';

import { HintButton } from '../../components/HintButton.jsx';

jest.unmock('../../components/HintButton.jsx');

describe('HintButton', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(<HintButton id="test" />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders HintButton dark', () => {
			const wrapper = shallow(<HintButton id="test" dark={true} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders HintButton light', () => {
			const wrapper = shallow(<HintButton id="test" dark={false} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders expanded HintButton', () => {
			const wrapper = shallow(<HintButton id="test" isExpanded={true} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {});
});
