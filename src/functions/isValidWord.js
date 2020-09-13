import { words } from '../constants/words';

export default word => words.includes(word);

// This could be done via backend but the speed vs size tradeoff is absurdly good
// so for now this will be done here.

// TODO: Make this even better
// - Need to somehow ensure this words.txt file used here is the same as the one
// in the backend. I want to do this without really hitting up s3, as that takes
// time I don't have.
// - Ensure that when /score-ing in the backend, it still runs validation on the
// words just in case.
