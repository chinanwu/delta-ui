import { shallow } from 'enzyme';
import React from 'react';

import { HintButton, mapStateToProps } from '../../components/HintButton.jsx';

jest.unmock('../../components/HintButton.jsx');
jest.unmock('../../functions/getThemeClassname');

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

		it('renders no hints left for daily', () => {
			const wrapper = shallow(
				<HintButton id="test" giveSolution={false} numHints={0} dark={true} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders no hints left for solo', () => {
			const wrapper = shallow(
				<HintButton id="test" giveSolution={true} numHints={0} dark={true} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('closes on click when expanded', () => {
			const onClose = jest.fn();
			const wrapper = shallow(
				<HintButton id="test" isExpanded={true} onClose={onClose} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('click');
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('gets hint on click when closed', () => {
			const onHint = jest.fn();
			const wrapper = shallow(
				<HintButton id="test" isExpanded={false} numHints={3} onHint={onHint} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('click');
			expect(onHint).toHaveBeenCalledTimes(1);
		});

		it('gets solution on click when out of hints', () => {
			const onSolnClick = jest.fn();
			const wrapper = shallow(
				<HintButton
					id="test"
					isExpanded={false}
					numHints={0}
					giveSolution={true}
					onSolnClick={onSolnClick}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('click');
			expect(onSolnClick).toHaveBeenCalledTimes(1);
		});

		it('does nothing on click when out of hints and not give solution', () => {
			const onSolnClick = jest.fn();
			const wrapper = shallow(
				<HintButton
					id="test"
					isExpanded={false}
					numHints={0}
					giveSolution={false}
					onSolnClick={onSolnClick}
				/>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
			wrapper.find('#test').simulate('click');
			expect(onSolnClick).not.toHaveBeenCalled();
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
