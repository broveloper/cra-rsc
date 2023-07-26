import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import { usePassage, useWords } from '@utils/useApp';

const useStyles = makeStyles((theme) => ({
	hinton: {
		color: 'rgba(253, 216, 53, 1)',
	},
	hintoff: {
		color: 'rgba(255, 255, 255, .5)',
	},
	hint: {
		transition: 'color 200ms linear',
	}
}));

export const HintButton = props => {
	const {
		className,
	} = props;
	const classes = useStyles();
	const {
		verses,
	} = usePassage();
	const {
		completed,
		showHint,
		toggleHint,
	} = useWords();

	if (completed || verses?.length < 1) return null;

	return <Fab
		tabIndex="-1"
		color="secondary"
		className={clsx(className, classes.hint, { [classes.hinton]: showHint, [classes.hintoff]: !showHint })}
		onClick={toggleHint}
		size="small">
		<EmojiObjectsIcon />
	</Fab>;
};