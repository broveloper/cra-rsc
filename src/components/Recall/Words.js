import _ from 'lodash';
import clsx from 'clsx';
import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useWords } from '@utils/useApp';

const useStyles = makeStyles((theme) => {
	return {
		root: {
			whiteSpace: 'pre-wrap',
			'& div, & [class*="input"] input': {
				color: theme.palette.text.primary,
				display: 'inline',
				fontFamily: '"Noto Serif", Georgia, "Times New Roman", Times, serif',
				fontSize: '16px',
				lineHeight: '32px',
			},
			'& [class*="v"]': {
				fontSize: '0.7em',
				letterSpacing: '-0.03em',
				verticalAlign: '0.25em',
				lineHeight: 0,
				top: 'inherit',
				'&::before, &::after': {
					content: '"\\a0"',
				},
			},
			'& [class*="text"]': {
			},
			'& [class*="gap"]': {
			},
			'& [class*="linebreak"]': {
				display: 'block',
				'& + *': {
					marginLeft: '2em',
				}
			},
		},
		hint: {
			'& div': {
				'& [class*="text"], & [class*="gap"]': {
					transition: 'opacity 300ms',
					opacity: 0,
				},
			},
		},
		show: {
			'& div': {
				'& [class*="text"], & [class*="gap"]': {
					opacity: .3,
				},
			},
		},
		test: {
			position: 'absolute',
			top: 0,
			left: 0,
			'& [class*="v"]': {
				opacity: 0,
			},
			'& [class*="input"]': {
				display: 'inline-block',
				minWidth: 1,
				outline: 'none !important',
			},
		},
	};
});


export const Words = props => {
	const { hint } = props;
	const {
		at,
		chunks,
		completed,
		inputProps,
		showHint,
	} = useWords();
	const classes = useStyles();
	const className = clsx(classes.root, {
		[classes.hint]: hint,
		[classes.show]: hint && showHint,
		[classes.test]: !hint,
	});
	const words = hint || completed
		? chunks
		: chunks.slice(0, at);
	if (!hint && !completed) {
		const nextWord = _.chain(chunks[at]).clone().assign({ input: true }).value()
		words.push(nextWord);
	}
	return <Box className={className}>
		{_.chain(words)
			.reduce((blocks, word, i) => {
				if (word.type === 'verse') blocks.push([word]);
				else blocks[blocks.length - 1].push(word);
				return blocks;
			}, [[]])
			.map((block, i) =>
				block.length === 0 ? null : <div key={i} className="block">
					{_.map(block, (word, j) => {
						const linebreak = word.newline ? <div className="linebreak"/> : null;
						const className = clsx({
							v: word.type === 'verse',
							gap: word.type === 'gap',
							text: word.type === 'word',
							input: word.input,
						});
						return <Fragment key={j}>
							{linebreak}
							{word.input
								? <div className={className} key={j} {...inputProps} />
								: <div className={className}>{String(word)}</div>}
						</Fragment>;
					})}
				</div>)
			.value()}
	</Box>
};