import _ from 'lodash';
import { forwardRef, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { usePassage, useProfile } from '@utils/useApp';
import { AppContainer } from 'components/App';
import { Screen } from '../Screen';

const useStyles = makeStyles({
	active: {
		'& .MuiListItemText-primary': {
			fontWeight: 'bold',
		},
	},
	item: {
		cursor: 'pointer',
	}
})

const BookmarksList = props => {
	const {
		hide,
		transitionState,
		type,
	} = props;
	const classes = useStyles();
	const {
		getProfile,
		profile,
	} = useProfile();
	const {
		setPassageVersion,
		versions,
	} = usePassage();

	const handleClick = recent => {
		hide();
		setPassageVersion(recent.passage, recent.version);
	};

	useEffect(() => {
		if (transitionState === 'entering') {
			getProfile();
		}
	}, [transitionState]);

	if (!profile) return null;

	return <>
		<Box py={2} component={AppContainer}>
			<Breadcrumbs>
				<Chip icon={<HomeIcon />} size="small" label="Main" onClick={() => hide()} />
				<Chip disabled size="small" label="Bookmarks" />
			</Breadcrumbs>
		</Box>
		<Box
			component={AppContainer}
			display="flex"
			flexDirection="column">
			<Box flex="1">
				<List dense={false}>
					{_.map(profile[type], passage => {
						return <ListItem button key={passage._id} onClick={() => handleClick(passage)}>
							<ListItemText
								className={classes.item}
								primary={passage.passage}
								secondary={versions[passage.version]?.name} />
						</ListItem>;
					})}
				</List>
			</Box>
		</Box>
	</>;
};

export const Bookmarks = forwardRef((props, ref) => {
	return <>
		<Route path="/bookmarks">
			<Screen appear in={true} ref={ref}>
				<BookmarksList type="passages" />
			</Screen>
		</Route>
		<Route path="/recents">
			<Screen appear in={true} ref={ref}>
				<BookmarksList type="recents" />
			</Screen>
		</Route>
	</>;
});