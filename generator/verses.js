const _ = require('lodash');
const { areSimilar } = require('./areSimilar');

const verses = [{"book_id":"JAS","book_name":"James","chapter":1,"text":"James, a servant of God and of the Lord Jesus Christ,","verse":1,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"To the twelve tribes in the Dispersion:","verse":1,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Greetings.","verse":1,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Count it all joy, my brothers, when you meet trials of various kinds,","verse":2,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"for you know that the testing of your faith produces steadfastness.","verse":3},{"book_id":"JAS","book_name":"James","chapter":1,"text":"And let steadfastness have its full effect, that you may be perfect and complete, lacking in nothing.","verse":4},{"book_id":"JAS","book_name":"James","chapter":1,"text":"If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.","verse":5,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"But let him ask in faith, with no doubting, for the one who doubts is like a wave of the sea that is driven and tossed by the wind.","verse":6},{"book_id":"JAS","book_name":"James","chapter":1,"text":"For that person must not suppose that he will receive anything from the Lord;","verse":7},{"book_id":"JAS","book_name":"James","chapter":1,"text":"he is a double-minded man, unstable in all his ways.","verse":8},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Let the lowly brother boast in his exaltation,","verse":9,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"and the rich in his humiliation, because like a flower of the grass he will pass away.","verse":10},{"book_id":"JAS","book_name":"James","chapter":1,"text":"For the sun rises with its scorching heat and withers the grass; its flower falls, and its beauty perishes. So also will the rich man fade away in the midst of his pursuits.","verse":11},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Blessed is the man who remains steadfast under trial, for when he has stood the test he will receive the crown of life, which God has promised to those who love him.","verse":12,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Let no one say when he is tempted, “I am being tempted by God,” for God cannot be tempted with evil, and he himself tempts no one.","verse":13},{"book_id":"JAS","book_name":"James","chapter":1,"text":"But each person is tempted when he is lured and enticed by his own desire.","verse":14},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Then desire when it has conceived gives birth to sin, and sin when it is fully grown brings forth death.","verse":15},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Do not be deceived, my beloved brothers.","verse":16,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom there is no variation or shadow due to change.","verse":17},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Of his own will he brought us forth by the word of truth, that we should be a kind of firstfruits of his creatures.","verse":18},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Know this, my beloved brothers: let every person be quick to hear, slow to speak, slow to anger;","verse":19,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"for the anger of man does not produce the righteousness of God.","verse":20},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Therefore put away all filthiness and rampant wickedness and receive with meekness the implanted word, which is able to save your souls.","verse":21},{"book_id":"JAS","book_name":"James","chapter":1,"text":"But be doers of the word, and not hearers only, deceiving yourselves.","verse":22,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"For if anyone is a hearer of the word and not a doer, he is like a man who looks intently at his natural face in a mirror.","verse":23},{"book_id":"JAS","book_name":"James","chapter":1,"text":"For he looks at himself and goes away and at once forgets what he was like.","verse":24},{"book_id":"JAS","book_name":"James","chapter":1,"text":"But the one who looks into the perfect law, the law of liberty, and perseveres, being no hearer who forgets but a doer who acts, he will be blessed in his doing.","verse":25},{"book_id":"JAS","book_name":"James","chapter":1,"text":"If anyone thinks he is religious and does not bridle his tongue but deceives his heart, this person's religion is worthless.","verse":26,"type":"newline"},{"book_id":"JAS","book_name":"James","chapter":1,"text":"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction, and to keep oneself unstained from the world.","verse":27}];

const generateWords = verses => _.chain(verses)
	.reduce(({ p, v }, { text, type, verse }) => {
		if (type === 'newline') {
			p.push(Object.assign(Object('\n\t'), { type, i: p.length }));
		}
		if (v !== verse) {
			p.push(Object.assign(Object(verse), { type: 'verse', i: p.length }));
			v = verse;
		}
		text.replace(/([a-zA-Z0-9']+)([^a-zA-Z0-9']+)?/g, (...args) => {
			if (args[1].length > 0) {
				p.push(Object.assign(Object(args[1]), { type: 'word', i: p.length }));
				if (args[2].length > 0) {
					p.push(Object.assign(Object(args[2]), { type: 'gap', i: p.length }));
				}
			}
		});
		return { p, v };
	}, { p: [], v: null })
	.thru(({ p }) => [p,  _.filter(p, c => c.type === 'word')])
	.value();
const generated = generateWords(verses);
const versesState = { at: 0, errors: [] };
const inputWords = q => {
	const currentIndex = versesState.at;
	const words = generated[1];
	q = q.split(/[^a-zA-Z0-9']+/);
	while (q.length > 0 && !areSimilar(q[0], String(words[currentIndex]))) {
		q.shift();
	}
	let i = 0;
	const errors = [];
	while (i < q.length && q[i] != null && words[currentIndex + i] != null) {
		const tryWord = q[i];
		const currentWord = String(words[currentIndex + i]);
		if (areSimilar(currentWord, tryWord)) {
			// console.log(`${currentWord} ${tryWord}`);
			i++; continue;
		}
		const currentNext = words[currentIndex + i + 1];
		if (currentNext != null && areSimilar(String(currentNext), tryWord)) {
			// console.log(`${String(currentNext)} ${tryWord}: inserted [${currentWord}]`);
			errors.push(Object.assign(Object(currentWord), { type: 'insert', i: currentIndex + i }))
			q.splice(i, 0, currentWord); i++; continue;
		}
		const tryNext = q[i + 1];
		if (tryNext != null && areSimilar(currentWord, tryNext)) {
			// console.log(`${currentWord} ${tryNext}: removed [${tryWord}]`);
			errors.push(Object.assign(Object(tryWord), { type: 'removed', i: currentIndex + i }))
			q.splice(i, 1); i++; continue;
		}
		// console.log('error');
		break;
	};
	return {
		at: words[currentIndex + i].i,
		errors: [...versesState.errors, ...errors],
	};
};

// const { chunks, words } = _.chain(verses)
// 	.reduce(({ p, v }, { text, type, verse }) => {
// 		if (type === 'newline') {
// 			p.push(Object.assign(Object('\n\t'), { type, i: p.length }));
// 		}
// 		if (v !== verse) {
// 			p.push(Object.assign(Object(verse), { type: 'verse', i: p.length })); v = verse;
// 		}
// 		text.replace(/([a-zA-Z0-9']+)([^a-zA-Z0-9']+)?/g, (...args) => {
// 			if (args[1].length > 0) {
// 				p.push(Object.assign(Object(args[1]), { type: 'word', i: p.length }));
// 				if (args[2].length > 0) {
// 					p.push(Object.assign(Object(args[2]), { type: 'gap', i: p.length }));
// 				}
// 			}
// 		});
// 		return { p, v };
// 	}, { p: [], v: null })
// 	.thru(({ p }) => {
// 		return {
// 			chunks: p,
// 			words: _.filter(p, c => c.type === 'word'),
// 		};
// 	})
// 	.value();

const main = 'James a servant of God and of the Lord Jesus Christ To the twelve tribes in the Dispersion Greetings Count it all joy my brothers when you meet trials of various kinds for you know that the testing of your faith produces steadfastness And let steadfastness have its full effect that you may be perfect and complete lacking in nothing If any of you lacks wisdom';
const tst1 = 'James a servant of God and of the Lord Jesus Christ To the twelve tribes the Dispersion Greetings Count it all joy my brothers when you meet trials of various kinds for you know that the testing of your faith produces steadfastness And let steadfastness have its full effect that you may be perfect and complete lacking in nothing If any of you lacks wisdom';
const tst2 = 'James a servant of God and of the Lord Jesus Christ To the twelve tribes in of the Dispersion Greetings Count it all joy my brothers when you meet trials of various kinds for you know that the testing of your faith produces steadfastness And let steadfastness have its full effect that you may be perfect and complete lacking in nothing If any of you lacks wisdom';

// 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness,'

// const getNextWord = (q, currentIndex) => {
// 	q = q.split(/[^a-zA-Z0-9']+/);
// 	while (q.length > 0 && !areSimilar(q[0], String(words[currentIndex]))) q.shift();
// 	let i = 0;
// 	const errors = [];
// 	while (i < q.length && q[i] != null && words[currentIndex + i] != null) {
// 		const tryWord = q[i];
// 		const currentWord = String(words[currentIndex + i]);
// 		if (areSimilar(currentWord, tryWord)) {
// 			console.log(`${currentWord} ${tryWord}`);
// 			i++; continue;
// 		}
// 		const currentNext = words[currentIndex + i + 1];
// 		if (currentNext != null && areSimilar(String(currentNext), tryWord)) {
// 			console.log(`${String(currentNext)} ${tryWord}: inserted [${currentWord}]`);
// 			errors.push(Object.assign(Object(currentWord), { type: 'insert', i: currentIndex + i }))
// 			q.splice(i, 0, currentWord); i++; continue;
// 		}
// 		const tryNext = q[i + 1];
// 		if (tryNext != null && areSimilar(currentWord, tryNext)) {
// 			console.log(`${currentWord} ${tryNext}: removed [${tryWord}]`);
// 			errors.push(Object.assign(Object(tryWord), { type: 'removed', i: currentIndex + i }))
// 			q.splice(i, 1); i++; continue;
// 		}
// 		console.log('error');
// 		break;
// 	};
// 	const index = words[currentIndex + i].i;
// 	return { index, errors };
// };

const test = str => {
	const { at, errors } = inputWords(str);
	const text = generated[0].slice(0, at).join('');
	console.log(text, { words: generated[0].slice(0, at), at, errors});
};
test(tst1);

// const tsim = (...words) => console.log(...words, areSimilar(...words));
// tsim('twelve', '12');
// tsim('forty thousand', '40000');
// tsim('one thousand', '1,000');


