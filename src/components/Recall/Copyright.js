import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { usePassage } from '@utils/useApp';
const useStyles = makeStyles({
	root: {
		whiteSpace: 'pre-wrap',
	}
});

export const Copyright = () => {
	const { bible } = usePassage();
	const classnames = useStyles();
	return <>
		<Box className={classnames.root} px={3} py={6}>
			<Typography
				align="center"
				component="div"
				variant="caption">
				{bible?.copyright}
			</Typography>
		</Box>
	</>;
};