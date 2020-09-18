import getWords from '../../functions/getWords';
import isValidWord from '../../functions/isValidWord';

jest.unmock('../../functions/getWords');
jest.unmock('../../functions/isValidWord');
jest.unmock('../../constants/words');

describe('getWords function', () => {
	it("returns two valid words that aren't equal", () => {
		const { from, to } = getWords();
		expect(isValidWord(from)).toBeTruthy();
		expect(isValidWord(to)).toBeTruthy();
		expect(from !== to).toBeTruthy();
	});
});
