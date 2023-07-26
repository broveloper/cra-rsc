import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { DictateButton } from 'components/DictateButton';
import { HintButton } from './HintButton';
import { RestartButton } from './RestartButton';


const useStyles = makeStyles((theme) => ({
	actions: {
		marginTop: theme.spacing(2),
	},
}));

export const Actions = () => {
	const classes = useStyles();

	return <>
		<Box
			position="absolute"
			right="1em"
			display="flex"
			flexDirection="column"
			bottom="2em">
			<RestartButton className={classes.actions} />
			<HintButton className={classes.actions} />
			<DictateButton className={classes.actions} />
		</Box>
	</>;
};