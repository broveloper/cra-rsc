import _ from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import { useAsync, useUpdateEffect } from 'react-use';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';
import { usePassage } from '@utils/useApp';
import { AppContainer } from 'components/App';
import { Screen } from '../Screen';

const useStyles = makeStyles(theme => ({
	item: {
		cursor: 'pointer',
	},
	check: {
		// color: theme.palette.success.main,
		// transform: 'scale(1.2)'
	},
}));

const PassageChapterSlider = props => {
	const {
		book,
		chapter,
		onChange,
	} = props;
	const [stateValue, setStateValue] = useState(chapter);
	useUpdateEffect(() => {
		setStateValue(chapter);
	}, [chapter]);
	return <Box px={2} my={2}>
		<Typography gutterBottom variant="body2">{`Chapter ${stateValue}`}</Typography>
		<Slider
			defaultValue={1}
			onChange={(e, value) => setStateValue(value)}
			onChangeCommitted={(e, value) => onChange(e, value)}
			step={1}
			marks
			min={1}
			max={book.chapters}
			value={stateValue} />
	</Box>;
};

const PassageVersesSlider = props => {
	const {
		book,
		chapter,
		onChange,
		verses,
	} = props;
	const {
		getChapter,
	} = usePassage();

	const { value: data } = useAsync(() => getChapter(book.book_name, chapter), [book.book_name, chapter]);
	const getRange = value => _.chain(value).split('-').filter().map(num => parseInt(num)).reject(isNaN)
		.thru(range => range.length === 0 ? [1, 1] : range.length === 1 ? [range[0], range[0]] : range)
		.value();
	const [stateValue, setStateValue] = useState(getRange(verses));
	useUpdateEffect(() => {
		setStateValue(getRange(verses));
	}, [verses]);

	return <Box px={2}>
		<Typography gutterBottom variant="body2">{`Verse${stateValue.length > 1 ? 's' : ''} ${_.uniq(stateValue).join('-')}`}</Typography>
		<Slider
			defaultValue={[1,1]}
			onChange={(e, value) => setStateValue(value)}
			onChangeCommitted={(e, value) => onChange(e, value)}
			step={1}
			min={1}
			max={data?.verses || 10}
			value={stateValue} />
	</Box>;
};

const PassageOptions = props => {
	const {
		hide,
		transitionState,
	} = props;
	const {
		getBooksBySearch,
		getSearchBookName,
		getSearchPassageMeta,
		isSearchValid,
		passage,
		setPassage,
	} = usePassage();
	const inputRef = useRef();
	const classes = useStyles();
	const [q, setQState] = useState(passage);
	const books = getBooksBySearch(q);

	const setQ = (q, options) => {
		if (isSearchValid(q)) {
			const qbookname = getSearchBookName(q);
			const books = getBooksBySearch(q);
			if (options?.tab && books.length > 0) {
				q = q.replace(qbookname, books[0]?.book_name);
			}
			setQState(q);
		} else if (!q) {
			setQState('');
		}
	};

	const handleSearch = () => {
		const [, c = 1, v] = getSearchPassageMeta(q);
		const books = getBooksBySearch(q);
		const bookname = books?.[0]?.book_name;
		if (bookname) {
			const cv = _.filter([c, v]).join(':');
			setPassage(`${bookname} ${cv}`);
		}
		hide();
	};

	const handleChange = e => {
		setQ(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Tab') {
			e.preventDefault();
			setQ(e.target.value, { tab: true });
		} else if (e.key === 'Enter' && isSearchValid(q)) {
			handleSearch();
		}
	};

	const handleSelect = book_name => {
		setQ(`${book_name} `);
		inputRef.current.focus();
	};

	const passageMeta = getSearchPassageMeta(q);
	const chapterValue = passageMeta[1] ? parseInt(passageMeta[1]) : 1;
	const handleChangeChapter = (e, value) => value !== chapterValue && setQ(`${passageMeta[0]} ${value}`);
	const handleChangeVerses = (e, value) => {
		value = _.chain(value).uniq().join('-').value();
		return value && setQ(`${passageMeta[0]} ${passageMeta[1]}:${value}`);
	};

	useUpdateEffect(() => {
		setQState(passage);
	}, [passage]);

	useEffect(() => {
		if (transitionState === 'entered') {
			inputRef.current.focus();
		}
	}, [transitionState]);

	return <>
		<Box py={2} component={AppContainer}>
			<Breadcrumbs>
				<Chip icon={<HomeIcon />} size="small" label="Main" onClick={() => hide()} />
				<Chip disabled size="small" label="Search Bible Passage" />
			</Breadcrumbs>
		</Box>
		<Box
			component={AppContainer}
			display="flex"
			alignItems="center"
			py={1}>
			<InputBase
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Search Passage"
				inputRef={inputRef}
				startAdornment={<InputAdornment position="start">
					<SearchIcon />
				</InputAdornment>}
				value={q} />
		</Box>
		<Divider />
		<Box
			component={AppContainer}
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'hidden scroll' }}
				display="flex"
				flexDirection="column"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%">
				<AppContainer>
					<List dense={true}>
						{_.map(books, book => {
							return <ListItem
								className={classes.item}
								key={book.book_id}>
								<ListItemText
									onClick={() => handleSelect(book.book_name)}
									primary={book.book_name}
									secondary={`${book.chapters} Chapters`} />
							</ListItem>;
						})}
					</List>
				</AppContainer>
				{books.length === 1 && <AppContainer>
					<PassageChapterSlider
						book={books[0]}
						chapter={chapterValue}
						onChange={handleChangeChapter} />
				</AppContainer>}
				{books.length === 1 && <AppContainer>
					<PassageVersesSlider
						book={books[0]}
						chapter={chapterValue}
						onChange={handleChangeVerses}
						verses={passageMeta[2]} />
				</AppContainer>}
			</Box>
			<Box
				position="absolute"
				right="1em"
				bottom="3em">
				<Fab
					className={classes.check}
					color="primary"
					disabled={!isSearchValid(q)}
					onClick={handleSearch}
					size="small">
					<CheckIcon />
				</Fab>
			</Box>
		</Box>
	</>;
};

export const SearchPassage = forwardRef((props, ref) => {
	return <Route path="search-passage">
		<Screen appear in={true} ref={ref}>
			<PassageOptions />
		</Screen>
	</Route>;
});