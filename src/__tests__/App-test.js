import { shallow, mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../App.jsx';
import Home from '../components/Home.jsx';
import NotFound from '../components/NotFound.jsx';
import Solo from '../components/Solo/Solo.jsx';

jest.unmock('../App.jsx');
jest.unmock('../components/NotFound.jsx'); // I have truly NO idea why I must do this to make the test pass

describe('App component', () => {
	describe('rendering', () => {
		it('renders App', () => {
			const wrapper = shallow(<App />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('routing', () => {
		it('routes to home', () => {
			const wrapper = mount(
				<MemoryRouter initialEntries={['/']} initialIndex={0}>
					<App />
				</MemoryRouter>
			);
			expect(wrapper.find(Home)).toHaveLength(1);
		});

		it('routes to solo', () => {
			const wrapper = mount(
				<MemoryRouter initialEntries={['/solo']} initialIndex={0}>
					<App />
				</MemoryRouter>
			);
			expect(wrapper.find(Home)).toHaveLength(0);
			expect(wrapper.find(Solo)).toHaveLength(1);
			expect(wrapper.find(NotFound)).toHaveLength(0);
		});

		it('routes to not found', () => {
			const wrapper = mount(
				<MemoryRouter initialEntries={['/fakeurllol']}>
					<App />
				</MemoryRouter>
			);
			expect(wrapper.find(Home)).toHaveLength(0);
			expect(wrapper.find(Solo)).toHaveLength(0);
			expect(wrapper.find(NotFound)).toHaveLength(1);
		});
	});
});
