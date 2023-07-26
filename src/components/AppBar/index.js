import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import AppBarMU from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HistoryIcon from '@material-ui/icons/History';
import BookIcon from '@material-ui/icons/Book';
import { Alert } from 'components/Alert';
import { useAppBar } from './useAppBar';

export const AppBar = props => {
	const history = useHistory();
	const {
		alertAddRef,
		addToPlaylist,
		// bookmarks,
		classes,
		passage,
		profile,
		// recents,
		// searchPassage,
		// searchVersion,
		// signin,
		signout,
		version,
	} = useAppBar();

	return <>
		<AppBarMU
			color="inherit"
			elevation={0}
			position="fixed">
			<Toolbar variant="dense">
				<IconButton
					edge="start"
					className={clsx(classes.section)}
					color="inherit">
					<div className={classes.logofont}>R</div>
					<div className={classes.logofont}>C</div>
					<div className={classes.logofont}>S</div>
				</IconButton>
				<div
					className={clsx(classes.section, classes.search)}
					onClick={() => history.push('/search-passage')}>
					<Typography variant="subtitle2">{passage || 'Search'}</Typography>
					<IconButton size="small">
						<ExpandMoreIcon fontSize="inherit" />
					</IconButton>
				</div>
				<div
					className={clsx(classes.section, classes.search)}
					onClick={() => history.push('/search-version')}>
					<Typography variant="subtitle2">{version}</Typography>
					<IconButton size="small">
						<ExpandMoreIcon fontSize="inherit" />
					</IconButton>
				</div>
				<div className={classes.grow} />
				<div className={classes.section}>
					{profile && <IconButton
						className={clsx(classes.action, classes.bookmark)}
						color="inherit"
						onClick={() => addToPlaylist()}
						size="small">
						<BookIcon fontSize="inherit" />
					</IconButton>}
					{profile && <IconButton
						className={clsx(classes.action, classes.recent)}
						color="inherit"
						onClick={() => history.push('/recents')}
						size="small">
						<HistoryIcon fontSize="inherit" />
					</IconButton>}
					{profile && <IconButton
						className={clsx(classes.action, classes.favorite)}
						color="inherit"
						onClick={() => history.push('/bookmarks')}
						size="small">
						<FavoriteIcon fontSize="inherit" />
					</IconButton>}
					{profile && <IconButton
						className={clsx(classes.action)}
						color="inherit"
						onClick={() => signout()}
						size="small">
						<ExitToAppIcon fontSize="inherit" />
					</IconButton>}
					{!profile && <IconButton
						className={classes.action}
						color="inherit"
						onClick={() => history.push('/signin')}
						size="small">
						<AccountCircleIcon fontSize="inherit" />
					</IconButton>}
				</div>
			</Toolbar>
		</AppBarMU>
		<Toolbar variant="dense" />
		<Alert alertRef={alertAddRef} severity="info">Successfully Bookmarked</Alert>
	</>;
};;