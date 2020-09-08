const express = require('express');
const router = express.Router();

router.get('/api/v1/ping', (req, res) => res.json({ message: 'pong' }));
// router.get('/api/v1/words', (req, res) =>
// 	res.json({ from: 'heat', to: 'cold' })
// );
router.get('/api/v1/words', (req, res) => res.json({ error: 'message' }));
router.get('/api/v1/validate', (req, res) => res.json({ success: true }));
router.get('/api/v1/hint', (req, res) =>
	res.json({ hint: 'meat', numLeft: 3 })
);
router.get('/api/v1/solve', (req, res) =>
	res.json({ solution: ['heat', 'meat', 'mead', 'meld', 'mold', 'cold'] })
);
router.get('/api/v1/score', (req, res) =>
	res.json({
		score: 99,
		optimalSolution: ['heat', 'meat', 'mead', 'meld', 'mold', 'cold'],
	})
);
router.get('/api/v1/dailychallenge', (req, res) =>
	res.json({
		id: '2020-09-06',
		from: 'quey',
		to: 'unau',
		leaderboard: [
			{ name: 'sock', score: 99 },
			{ name: 'slmn', score: 81 },
			{ name: 'sam1', score: 70 },
			{ name: 'sam2', score: 69 },
			{ name: 'sam3', score: 50 },
			{ name: 'sam4', score: 31 },
			{ name: 'john', score: 30 },
			{ name: 'sam5', score: 20 },
			{ name: 'sam6', score: 10 },
			{ name: 'sam6', score: 2 },
		],
	})
);
router.put('/api/v1/highscore', (req, res) =>
	res.json({
		message: 'Successfully updated leaderboard!',
	})
);
router.get('/api/v1/allWords', (req, res) =>
	res.json({
		words: ['heat', 'meat', 'mead', 'meld', 'mold', 'cold', 'quey', 'unau'],
	})
);

module.exports = router;
