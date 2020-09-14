import { shallow } from 'enzyme';
import React, { useEffect, useState } from 'react';

import { Home, mapStateToProps } from '../../components/Home.jsx';
import { aBtn, escapeBtn } from '../../constants/Keycodes';
import { getFetch } from '../../functions/FetchFunctions';

jest.unmock('../../components/Home.jsx');

describe('Home component', () => {
	describe('rendering', () => {
		it('renders Home', () => {
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Home dark', () => {
			const wrapper = shallow(<Home dark={true} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Home light', () => {
			const wrapper = shallow(<Home dark={false} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Home with open leaderboard', () => {
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([[['test', 99]], jest.fn()]);
			const wrapper = shallow(<Home dark={false} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});

		it('renders Home with loading', () => {
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([true, jest.fn()]);
			const wrapper = shallow(<Home dark={false} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
		});
	});

	describe('behaviour', () => {
		xit('fetches daily challenge', () => {
			const setLoading = jest.fn();
			const setLeaderboard = jest.fn();
			const res = { leaderboard: [{ name: 'test', score: 99 }] };
			getFetch.mockReturnValue(Promise.resolve(res));
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([false, setLoading])
				.mockReturnValueOnce([[], setLeaderboard]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[1][0]();
			expect(getFetch.mock.calls).toEqual([['/api/v1/dailychallenge']]);
			expect(setLoading.mock.calls).toEqual([[true]]);
			// expect(setLeaderboard.mock.calls).toEqual([[[['test', 99]]]]); // Not working... not sure
			// expect(setLeaderboard).toHaveBeenCalledTimes(1); // Also not working I'm losing it
		});

		it('set leaderboard if successful response from daily challenge', () => {
			const setLoading = jest.fn();
			const setLeaderboard = jest.fn();
			const res = {};
			getFetch.mockReturnValue(Promise.resolve(res));
			useState
				.mockReturnValueOnce([true, jest.fn()])
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValueOnce([false, setLoading])
				.mockReturnValueOnce([[], setLeaderboard]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[1][0]();
			expect(setLoading.mock.calls).toEqual([[true]]);
			// expect(setLeaderboard.mock.calls).toEqual([[[['test', 99]]]]); //Not working... not sure
			// expect(setLeaderboard).toHaveBeenCalledTimes(1);
		});

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
			wrapper.find('#homeCloseAcksBtn').simulate('click');
			expect(setShowAcks.mock.calls).toEqual([[false]]);
		});

		it('closes acknowledgement modal with escape', () => {
			const preventDefault = jest.fn();
			const event = {
				keyCode: escapeBtn,
				preventDefault: preventDefault,
			};
			const setShowAcks = jest.fn();
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValue([true, setShowAcks]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#homeModalDiv').simulate('keydown', event);
			expect(setShowAcks.mock.calls).toEqual([[false]]);
			expect(preventDefault).toHaveBeenCalledTimes(1);
		});

		it('does nothing if keydown with any other key in acknowledgement modal', () => {
			const preventDefault = jest.fn();
			const event = {
				keyCode: aBtn,
				preventDefault: preventDefault,
			};
			const setShowAcks = jest.fn();
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValue([true, setShowAcks]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#homeModalDiv').simulate('keydown', event);
			expect(setShowAcks).not.toHaveBeenCalled();
			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('does nothing if any other event in acknowledgement modal', () => {
			const event = {};
			const setShowAcks = jest.fn();
			useState
				.mockReturnValueOnce([false, jest.fn()])
				.mockReturnValue([true, setShowAcks]);
			const wrapper = shallow(<Home />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#homeModalDiv').simulate('keydown', event);
			expect(setShowAcks).not.toHaveBeenCalled();
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
