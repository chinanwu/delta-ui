import React from 'react';
import { shallow } from 'enzyme';

import { ThemeToggle, mapStateToProps } from '../../components/ThemeToggle.jsx';

jest.unmock('../../components/ThemeToggle.jsx');

describe('ThemeToggle', () => {
	describe('rendering', () => {
		it('renders ThemeToggle', () => {
			const wrapper = shallow(<ThemeToggle />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders ThemeToggle dark mode', () => {
			const wrapper = shallow(
				<ThemeToggle dark={true} onChangeTheme={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders ThemeToggle light', () => {
			const wrapper = shallow(
				<ThemeToggle dark={false} onChangeTheme={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('changes the theme', () => {
			const onChangeTheme = jest.fn();
			const wrapper = shallow(
				<ThemeToggle dark={true} onChangeTheme={onChangeTheme} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#themeToggleInput').simulate('change');
			expect(onChangeTheme.mock.calls).toEqual([[false]]);
		});
	});

	describe('mapStateToProps', () => {
		it('returns mapped properties', () => {
			const theme = { dark: true };
			expect(mapStateToProps({ theme })).toEqual({ dark: true });
		});
	});
});
