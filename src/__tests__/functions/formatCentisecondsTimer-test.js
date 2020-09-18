import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';

jest.unmock('../../functions/formatCentisecondsTimer');

describe('formatCentisecondsTimer function', () => {
	it('returns formatted timer', () => {
		expect(formatCentisecondsTimer(1)).toEqual('00m : 00s : 01cs');
		expect(formatCentisecondsTimer(100)).toEqual('00m : 01s : 00cs');
		expect(formatCentisecondsTimer(6000)).toEqual('01m : 00s : 00cs');
		expect(formatCentisecondsTimer(67111)).toEqual('11m : 11s : 11cs');
	});
});
