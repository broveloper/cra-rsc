import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import MicIcon from '@material-ui/icons/Mic';
import { createMuiTheme } from '@material-ui/core/styles';
import { useDictate } from './useDictate';

const useStyles = makeStyles((theme) => ({
	active: {
		animation: 'opacitypulse 1200ms linear infinite',
	},
}));

const micTheme = createMuiTheme({
	palette: {
		primary: { main: '#de1b28', contrastText: '#fff' },
	},
})

export const DictateButton = props => {
	const {
		className,
	} = props;
	const classes = useStyles();
	const {
		active,
		enabled,
		toggle,
	} = useDictate(props);

	if (!enabled) return null;
	
	return <>
		<ThemeProvider theme={micTheme}>
			<Fab
				className={clsx(className)}
				color="primary"
				onClick={toggle}
				size="small">
				<MicIcon className={clsx({ [classes.active]: active })} />
			</Fab>
		</ThemeProvider>
	</>;
};