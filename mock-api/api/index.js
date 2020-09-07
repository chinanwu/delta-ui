const express = require('express');
const router = express.Router();

router.get('/api/v1/ping', (req, res) => res.json({ message: 'pong' }));
router.get('/api/v1/words', (req, res) =>
	res.json({ from: 'heat', to: 'cold' })
);
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
			{ name: 'sox', score: 99 },
			{ name: 'atl', score: 81 },
			{ name: 'sea', score: 70 },
		],
	})
);
router.get('/api/v1/allWords', (req, res) =>
	res.json({
		words: ['heat', 'meat', 'mead', 'meld', 'mold', 'cold', 'quey', 'unau'],
	})
);

module.exports = router;
