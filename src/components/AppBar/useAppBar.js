import _ from 'lodash';
import { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth, usePassage, useProfile, useScreen } from '@utils/useApp';

const colors = {
	black: '#000',
	gold: '#aa7b33',
	green: '#6b8233',
	red: '#de1b28',
	white: '#fff',
};

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	search: {
		whiteSpace: 'nowrap',
		marginLeft: theme.spacing(1),
		cursor: 'pointer',
	},
	section: {
		display: 'flex',
		alignItems: 'center',
	},
	action: {
		marginLeft: theme.spacing(1.5),
	},
	bookmark: {
		color: '#ff5722',
	},
	favorite: {
		color: '#e91e63',
	},
	recent: {
		color: '#9c27b0',
	},
	logofont: {
		fontFamily: '"Noto Serif", Georgia, "Times New Roman", Times, serif',
		fontWeight: 'bold',
		fontSize: '18px',
		display: 'inline-block',
		color: colors.gold,
		textShadow: `-1px 1px 0 ${colors.white}, 1px 1px 0 ${colors.white}, 1px -1px 0 ${colors.white}, -1px -1px 0 ${colors.white}`,
		letterSpacing: '-1.5px',	
	}
}));

export const useAppBar = () => {
	const classes = useStyles();
	const {
		signout,
	} = useAuth();
	const {
		bookmarks,
		recents,
		searchPassage,
		searchVersion,
		signin,
	} = useScreen();
	const {
		passage,
		version,
	} = usePassage();
	const {
		bookmarkPassage,
		profile,
	} = useProfile();
	const alertAddRef = useRef();
	const addToPlaylist = async () => {
		if (_.find(profile.passages, { passage })) {
			alertAddRef.current.alert('Already bookmarked.');
		} else {
			await bookmarkPassage(passage, version);
			alertAddRef.current.setOpen(true);
		}
	};

	return {
		alertAddRef,
		addToPlaylist,
		bookmarks,
		classes,
		passage,
		profile,
		recents,
		searchPassage,
		searchVersion,
		signin,
		signout,
		version,
	};
};