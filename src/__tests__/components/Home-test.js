import { shallow } from 'enzyme';
import React, { useEffect, useState } from 'react';

import { Home, mapStateToProps } from '../../components/Home.jsx';

jest.unmock('../../components/Home.jsx');
jest.unmock('../../functions/getThemeClassname');

// mock the HOC
jest.mock('../../components/HOC/withTitle', () => () => Component => props => (
	<Component {...props} />
));

describe('Home component', () => {
	describe('rendering', () => {
		it('renders Home', () => {
			const wrapper = shallow(
				<Home dark={false} loading={false} getDaily={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Home dark', () => {
			const getDaily = jest.fn();
			const wrapper = shallow(
				<Home dark={true} loading={false} getDaily={getDaily} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(getDaily).toHaveBeenCalledTimes(1);
		});

		it('renders Home light', () => {
			const getDaily = jest.fn();
			const wrapper = shallow(
				<Home dark={false} loading={false} getDaily={getDaily} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(getDaily).toHaveBeenCalledTimes(1);
		});

		it('renders Home with open leaderboard', () => {
			const getDaily = jest.fn();
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()]);
			const wrapper = shallow(
				<Home
					dark={false}
					leaderboard={['test', 99]}
					loading={false}
					getDaily={getDaily}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(getDaily).not.toHaveBeenCalled();
		});

		it('renders Home with open empty leaderboard', () => {
			const getDaily = jest.fn();
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()]);
			const wrapper = shallow(
				<Home
					dark={false}
					leaderboard={[]}
					loading={false}
					getDaily={getDaily}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(getDaily).not.toHaveBeenCalled();
		});

		it('renders Home with loading', () => {
			const getDaily = jest.fn();
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()]);
			const wrapper = shallow(
				<Home
					dark={false}
					leaderboard={null}
					loading={true}
					getDaily={getDaily}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(getDaily).toHaveBeenCalledTimes(1);
		});

		it('renders Home with open acknowledgements', () => {
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([true, jest.fn()]);
			const wrapper = shallow(
				<Home
					dark={false}
					leaderboard={[]}
					loading={false}
					getDaily={jest.fn()}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('shows leaderboard when click on accordion', () => {
			const setShowLeaderboard = jest.fn();
			useState.mockReturnValue([false, setShowLeaderboard]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#homeLeaderboardBtn').simulate('click');
			expect(setShowLeaderboard).toHaveBeenCalledTimes(1);
		});

		it('opens acknowledgement modal', () => {
			const setShowAcks = jest.fn();
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValue([false, setShowAcks]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#homeOpenAcksBtn').simulate('click');
			expect(setShowAcks.mock.calls).toEqual([[true]]);
		});

		it('closes acknowledgement modal', () => {
			const setShowAcks = jest.fn();
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValue([true, setShowAcks]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#modal').prop('onClose')();
			expect(setShowAcks.mock.calls).toEqual([[false]]);
		});

		// it('closes acknowledgement modal', () => {
		// 	const setShowAcks = jest.fn();
		// 	useState
		// 		.mockReturnValueOnce([false, jest.fn()])
		// 		.mockReturnValue([true, setShowAcks]);
		// 	const wrapper = shallow(<Home />);
		// 	expect(wrapper.getElement()).toMatchSnapshot();
		// 	wrapper.find('#homeCloseAcksBtn').simulate('click');
		// 	expect(setShowAcks.mock.calls).toEqual([[false]]);
		// });

		// it('closes acknowledgement modal with escape', () => {
		// 	const preventDefault = jest.fn();
		// 	const event = {
		// 		keyCode: escapeBtn,
		// 		preventDefault: preventDefault,
		// 	};
		// 	const setShowAcks = jest.fn();
		// 	useState
		// 		.mockReturnValueOnce([false, jest.fn()])
		// 		.mockReturnValue([true, setShowAcks]);
		// 	const wrapper = shallow(<Home />);
		// 	expect(wrapper.getElement()).toMatchSnapshot();
		// 	wrapper.find('#homeModalDiv').simulate('keydown', event);
		// 	expect(setShowAcks.mock.calls).toEqual([[false]]);
		// 	expect(preventDefault).toHaveBeenCalledTimes(1);
		// });
		//
		// it('does nothing if keydown with any other key in acknowledgement modal', () => {
		// 	const preventDefault = jest.fn();
		// 	const event = {
		// 		keyCode: aBtn,
		// 		preventDefault: preventDefault,
		// 	};
		// 	const setShowAcks = jest.fn();
		// 	useState
		// 		.mockReturnValueOnce([false, jest.fn()])
		// 		.mockReturnValue([true, setShowAcks]);
		// 	const wrapper = shallow(<Home />);
		// 	expect(wrapper.getElement()).toMatchSnapshot();
		// 	wrapper.find('#homeModalDiv').simulate('keydown', event);
		// 	expect(setShowAcks).not.toHaveBeenCalled();
		// 	expect(preventDefault).not.toHaveBeenCalled();
		// });
		//
		// it('does nothing if any other event in acknowledgement modal', () => {
		// 	const event = {};
		// 	const setShowAcks = jest.fn();
		// 	useState
		// 		.mockReturnValueOnce([false, jest.fn()])
		// 		.mockReturnValue([true, setShowAcks]);
		// 	const wrapper = shallow(<Home />);
		// 	expect(wrapper.getElement()).toMatchSnapshot();
		// 	wrapper.find('#homeModalDiv').simulate('keydown', event);
		// 	expect(setShowAcks).not.toHaveBeenCalled();
		// });
	});

	describe('mapStateToProps', () => {
		it('returned mapped properties', () => {
			const theme = { dark: true };
			const home = { loading: false, leaderboard: [] };
			const state = { theme, home };
			expect(mapStateToProps(state)).toEqual({
				loading: false,
				leaderboard: [],
				dark: true,
			});
		});
	});
});
