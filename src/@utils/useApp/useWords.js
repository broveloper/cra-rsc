import _ from 'lodash';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { isMobile } from 'react-device-detect';
import logger from '@utils/logger';
import { areSimilar } from '@utils/similar';
import { usePassage } from '@utils/useApp';


const generateWords = verses => _.chain(verses)
	.reduce(({ p, v }, { text, type, verse }, i) => {
		const meta = {
			newline: type === 'newline' || i === 0,
		};
		if (v !== verse) {
			p.push(Object.assign(Object(verse), { type: 'verse', i: p.length }, meta));
			delete meta.newline;
			v = verse;
		}
		text.replace(/([a-zA-Z0-9']+)([^a-zA-Z0-9']+)?/g, (...args) => {
			if (args[1].length > 0) {
				p.push(Object.assign(Object(args[1]), { type: 'word', i: p.length }, meta));
				delete meta.newline;
				if (args[2]?.length > 0) {
					p.push(Object.assign(Object(args[2]), { type: 'gap', i: p.length }, meta));
				}
			}
		});
		return { p, v };
	}, { p: [], v: null })
	.thru(({ p }) => [p, _.filter(p, c => c.type === 'word')])
	.value();


const Context = createContext(null);

export const useWords = () => useContext(Context);

export const WordsProvider = props => {
	const { verses } = usePassage();

	const [chunks, words] = useMemo(() => generateWords(verses), [verses]);
	const atRef = useRef(words[0]?.i);
	const [at, setAt] = useState(atRef.current);
	const setAtState = at => setAt(atRef.current = at);
	const [showHint, setShowHint] = useState(false);
	const toggleHint = () => setShowHint(!showHint);
	const inputRef = useRef();
	const errorsRef = useRef([]);

	const completed = chunks.length > 0 && chunks.length === atRef.current;

	const resetWords = () => {
		errorsRef.current = [];
		logger.reset();
		atRef.current = words[0]?.i;
		setShowHint(false);
		setAtState(atRef.current);
		if (inputRef.current) inputRef.current.innerHTML = '';
	};

	const inputWords = useCallback(q => {
		if (completed) return false;

		const currentIndex = _.findIndex(words, word => word.i === atRef.current);
		logger.log('inputWords start:', { q, at, atRef: atRef.current });
		q = q.trim().split(/[^a-zA-Z0-9']+/);
		while (q.length > 0 && !areSimilar(q[0], String(words[currentIndex]))) {
			q.shift();
		}
		if (q.length < 1) return false;
		logger.log('inputWords mid:', { q, at, atRef: atRef.current, currentIndex });

		let i = 0;
		while (i < q.length && q[i] != null && words[currentIndex + i] != null) {
			const tryWord = q[i];
			const currentWord = String(words[currentIndex + i]);
			if (areSimilar(tryWord, currentWord)) {
				logger.log({ currentWord, tryWord });
				i++; continue;
			}
			if (i + 2 === q.length) {
				break;
			}
			const currentNext = words[currentIndex + i + 1];
			if (currentNext != null && areSimilar(tryWord, String(currentNext))) {
				logger.log({ currentNext: String(currentNext), tryWord }, `inserted: [${currentWord}]`);
				errorsRef.current.push(Object.assign(Object(currentWord), { type: 'insert', i: currentIndex + i }))
				q.splice(i, 0, currentWord); i++; continue;
			}
			const tryNext = q[i + 1];
			if (tryNext != null && areSimilar(tryNext, currentWord)) {
				logger.log({ currentWord, tryWord }, `removed [${tryWord}]`);
				errorsRef.current.push(Object.assign(Object(tryWord), { type: 'removed', i: currentIndex + i }))
				q.splice(i, 1); i++; continue;
			}
			// logger.log('end:', errorsRef.current);
			break;
		};
		atRef.current = currentIndex + i < words.length
			? words[currentIndex + i].i
			: chunks[chunks.length - 1].i;
		setAt(atRef.current);
		return true;
	}, [words]);

	const inputProps = {
		contentEditable: true,
		dangerouslySetInnerHTML: {
			__html: '',
		},
		onInput: e => {
			const text = e.target?.textContent;
			if (/^[^a-zA-Z0-9,']+/.test(text)) {
				logger.log('onInput: started with gap', text);
				e.preventDefault();
				e.stopPropagation();
				inputRef.current.innerHTML = '';
			} else if (/[^a-zA-Z0-9,']+/.test(text)) {
				logger.log('onInput: inputWords', text, String(chunks[atRef.current]));
				const didInput = inputWords(text);
				if (didInput)
					_.defer(() => inputRef.current.focus());
				_.defer(() => inputRef.current.innerHTML = '');
			} else if ((isMobile && text.length === String(chunks[atRef.current]).length) && areSimilar(text, String(chunks[atRef.current]))) {
				logger.log('onInput: mobile check inputWords', text, String(chunks[atRef.current]));
				inputWords(text);
				_.defer(() => inputRef.current.focus());
				_.defer(() => inputRef.current.innerHTML = '');
			} else {
				logger.log('onInput', { text, type: e.nativeEvent.type });
			}
		},
		onPaste: e => {
			logger.log('onPaste', 'No pasting allowed', e.target.textContent);
			e.preventDefault();
			e.stopPropagation();
		},
		ref: inputRef,
	};

	useUpdateEffect(() => {
		resetWords();
	}, [words]);

	const state = {
		at,
		chunks,
		completed,
		inputWords,
		inputProps,
		inputRef,
		resetWords,
		showHint,
		toggleHint,
	};

	return <Context.Provider value={state}>
		{props.children}
	</Context.Provider>;
};