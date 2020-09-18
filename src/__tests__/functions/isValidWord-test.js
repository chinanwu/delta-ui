import isValidWord from '../../functions/isValidWord';

jest.unmock('../../functions/isValidWord');
jest.unmock('../../constants/words');

describe('isValidWord function', () => {
	it('returns true if valid word', () => {
		expect(isValidWord('word')).toBeTruthy();
	});

	it('returns false if not valid word', () => {
		expect(isValidWord('asdf')).toBeFalsy();
	});
});
