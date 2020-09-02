import React, { useCallback, useState } from 'react';

import './Playground.less';

export const Playground = () => {
	const [history, setHistory] = useState(['test', 'best']);
	const [hints, setHints] = useState(null);

	// const getHintLi = content => <li>{content}</li>;

	// const handleClick = useCallback(() => {
	// 	const fake = 'fake';
	// 	const to = 'poop';
	// 	const stepsLeft = 3;
	// 	let ul = document.getElementById('testUl');
	// 	// next step
	// 	let li = document.createElement('li');
	// 	li.appendChild(document.createTextNode(fake));
	// 	li.setAttribute('class', 'HintLi'); // added line
	// 	ul.appendChild(li);
	//
	// 	// num steps left
	// 	for (let i = 0; i < stepsLeft; i++) {
	// 		let li = document.createElement('li');
	// 		li.appendChild(document.createTextNode('XXXX'));
	// 		li.setAttribute('class', 'StepLi'); // added line
	// 		ul.appendChild(li);
	// 	}
	//
	// 	let toLi = document.createElement('li');
	// 	toLi.appendChild(document.createTextNode(to));
	// 	toLi.setAttribute('class', 'ToLi'); // added line
	// 	ul.appendChild(toLi);
	// }, []);
	//
	// const handleFakeSubmit = useCallback(() => {
	// 	setHistory(history => [...history, 'poop']);
	//
	// 	let ul = document.getElementById('testUl');
	// 	for (let i = 0; i < ul.children.length; i++) {
	// 		console.log(i);
	// 		let li = ul.children[i];
	// 		console.log(li.innerHTML);
	// 		console.log(history.includes(li.innerHTML));
	// 		if (!history.includes(li.innerHTML)) {
	// 			console.log('removing');
	// 			ul.removeChild(li);
	// 		}
	// 	}
	// }, [history, setHistory]);

	const handleClick = useCallback(() => {
		setHints({ hint: 'fake', num: 6 });
	}, [setHints]);

	const handleFakeSubmit = useCallback(() => {
		setHints(null);
		setHistory(history => [...history, 'poop']);
	}, [setHints, setHistory]);

	const makeStep = num => {
		let all = [];
		for (let i = 0; i < hints.num; i++) {
			all[i] = (
				<li className="StepLi" key={'stepHInt--' + i}>
					?
				</li>
			);
		}
		return all;
	};

	return (
		<div>
			<ul id="testUl" className="TestUl">
				{history.map((e, i) => (
					<li key={i}>{e}</li>
				))}
				{hints && (
					<>
						<li className="HintLi">{hints.hint}</li>
						{makeStep(hints.num)}
						<li>poop</li>
					</>
				)}
			</ul>

			<button onClick={handleClick}>Get a hint</button>
			<button onClick={handleFakeSubmit}> Fake Submit</button>
		</div>
	);
};

export default Playground;
