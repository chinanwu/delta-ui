import React, { useEffect, useState, useRef } from 'react';
import { shallow } from 'enzyme';

import { Guess, mapStateToProps } from '../../components/Guess.jsx';
import {
	aBtn,
	backspaceBtn,
	enterBtn,
	escapeBtn,
	leftArrowBtn,
	rightArrowBtn,
	tabBtn,
	zBtn,
} from '../../constants/Keycodes';

jest.unmock('../../components/Guess.jsx');

describe('Guess', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders with props', () => {
			const setGuessVals = jest.fn();
			useState.mockReturnValue([['.', '.', '.', '.'], setGuessVals]);
			const wrapper = shallow(
				<Guess dark={true} prevWord="food" error="" onGuess={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			useEffect.mock.calls[0][0]();
			expect(setGuessVals.mock.calls).toEqual([[['f', 'o', 'o', 'd']]]);
		});
	});

	describe('behaviour', () => {
		it('submits when enter button is clicked', () => {
			const onGuess = jest.fn();
			const setGuessVals = jest.fn();
			const ref = { current: { value: 'f' } };
			useState.mockReturnValue([['g', 'o', 'o', 'd'], setGuessVals]);
			useRef.mockReturnValue(ref);
			const wrapper = shallow(
				<Guess dark={true} prevWord="food" error="" onGuess={onGuess} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessEnterBtn').simulate('click');
			expect(onGuess.mock.calls).toEqual([['good']]);
			expect(setGuessVals.mock.calls).toEqual([[['f', 'o', 'o', 'd']]]);
		});

		it('submits when enter is pressed', () => {
			const preventDefault = jest.fn();
			const onGuess = jest.fn();
			const setGuessVals = jest.fn();
			const focus = jest.fn();
			const ref = { current: { value: 'f', focus } };
			const event = {
				target: { dataset: { id: 0 } },
				key: 'enter',
				keyCode: enterBtn,
				preventDefault: preventDefault,
			};
			useState.mockReturnValue([['g', 'o', 'o', 'd'], setGuessVals]);
			useRef.mockReturnValue(ref);
			const wrapper = shallow(<Guess prevWord="food" onGuess={onGuess} />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(onGuess.mock.calls).toEqual([['good']]);
			expect(setGuessVals.mock.calls).toEqual([[['f', 'o', 'o', 'd']]]);
			expect(focus).toHaveBeenCalledTimes(1);
			expect(preventDefault).toHaveBeenCalledTimes(1);
		});

		it('moves to next box when enter a letter', () => {
			const setGuessVals = jest.fn();
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'g' } };
			const secondRef = { current: { value: 'o', focus, select } };
			const otherRefs = { current: { value: 'o' } };
			const event = {
				target: { dataset: { id: 0 } },
				key: 'a',
				keyCode: aBtn,
				preventDefault: preventDefault,
			};
			useState.mockReturnValue([['g', 'o', 'o', 'd'], setGuessVals]);
			useRef
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(secondRef)
				.mockReturnValue(otherRefs);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(focus).toHaveBeenCalledTimes(1);
			expect(select).toHaveBeenCalledTimes(1);
			// expect(setGuessVals.mock.calls).toEqual([[['a', 'o', 'o', 'd']]]); // TODO: Functional state setter
			expect(setGuessVals).toHaveBeenCalledTimes(1);
			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(ref.current.value).toEqual('a');
		});

		it("doesn't move to first box when enter last letter", () => {
			const setGuessVals = jest.fn();
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'o', focus, select } };
			const currentRef = { current: { value: 'd', focus, select } };
			const event = {
				target: { dataset: { id: 3 } },
				key: 'z',
				keyCode: zBtn,
				preventDefault: preventDefault,
			};
			useState.mockReturnValue([['g', 'o', 'o', 'd'], setGuessVals]);
			useRef
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(currentRef);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_3').simulate('keydown', event);
			expect(focus).not.toHaveBeenCalled();
			expect(select).not.toHaveBeenCalled();
			// expect(setGuessVals.mock.calls).toEqual([[['a', 'o', 'o', 'd']]]); // TODO: Functional state setter
			expect(setGuessVals).toHaveBeenCalledTimes(1);
			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(currentRef.current.value).toEqual('z');
		});

		it('goes to previous box and focuses when backspace', () => {
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'f', focus, select } };
			const currentRef = { current: { value: 'o' } };
			const otherRefs = { current: { value: 'o' } };
			const event = {
				target: { dataset: { id: 1 } },
				key: 'backspace',
				keyCode: backspaceBtn,
				preventDefault: preventDefault,
			};
			useRef
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(currentRef)
				.mockReturnValue(otherRefs);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_1').simulate('keydown', event);
			expect(focus).toHaveBeenCalledTimes(1);
			expect(select).toHaveBeenCalledTimes(1);
			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(currentRef.current.value).toEqual('');
		});

		it("doesn't do anything when backspace on first box", () => {
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'f', focus, select } };
			const event = {
				target: { dataset: { id: 0 } },
				key: 'backspace',
				keyCode: backspaceBtn,
				preventDefault: preventDefault,
			};
			useRef.mockReturnValue(ref);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_1').simulate('keydown', event);
			expect(focus).not.toHaveBeenCalled();
			expect(select).not.toHaveBeenCalled();
			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(ref.current.value).toEqual('');
		});

		it('moves to next box when right arrow', () => {
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'f' } };
			const secondRef = { current: { value: 'f', focus, select } };
			const event = {
				target: { dataset: { id: 0 } },
				key: 'right arrow',
				keyCode: rightArrowBtn,
				preventDefault: preventDefault,
			};
			useRef
				.mockReturnValueOnce(ref)
				.mockReturnValueOnce(secondRef)
				.mockReturnValue(ref);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(focus).toHaveBeenCalledTimes(1);
			expect(select).toHaveBeenCalledTimes(1);
			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('moves to previous box when left arrow', () => {
			const preventDefault = jest.fn();
			const focus = jest.fn();
			const select = jest.fn();
			const ref = { current: { value: 'f', focus, select } };
			const otherRefs = { current: { value: 'f' } };
			const event = {
				target: { dataset: { id: 1 } },
				key: 'left arrow',
				keyCode: leftArrowBtn,
				preventDefault: preventDefault,
			};
			useRef.mockReturnValueOnce(ref).mockReturnValue(otherRefs);
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(focus).toHaveBeenCalledTimes(1);
			expect(select).toHaveBeenCalledTimes(1);
			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('does nothing when tab is pressed', () => {
			const preventDefault = jest.fn();
			const event = {
				target: { dataset: { id: 0 } },
				key: 'tab',
				keyCode: tabBtn,
				preventDefault: preventDefault,
			};
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('prevents other key presses', () => {
			const preventDefault = jest.fn();
			const event = {
				target: { dataset: { id: 0 } },
				key: 'escape',
				keyCode: escapeBtn,
				preventDefault: preventDefault,
			};
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(preventDefault).toHaveBeenCalledTimes(1);
		});

		it('does nothing when event is invalid', () => {
			const preventDefault = jest.fn();
			const event = {
				target: { dataset: { id: 0 } },
				key: 'backspace',
				keyCode: backspaceBtn,
				preventDefault: preventDefault,
				ctrlKey: true,
			};
			const wrapper = shallow(<Guess />);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#guessInput_0').simulate('keydown', event);
			expect(preventDefault).not.toHaveBeenCalled();
		});
	});

	describe('mapStateToProps', () => {
		it('returns mapped properties', () => {
			const theme = { dark: true };
			expect(mapStateToProps({ theme })).toEqual(theme);
		});
	});
});
