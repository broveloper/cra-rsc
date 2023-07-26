import Fab from '@material-ui/core/Fab';
import ReplayIcon from '@material-ui/icons/Replay';
import { usePassage, useWords } from '@utils/useApp';


export const RestartButton = props => {
	const {
		className,
	} = props;
	const {
		verses,
	} = usePassage();
	const {
		completed,
		resetWords,
	} = useWords();

	if (completed || verses?.length < 1) return null;

	return <Fab
		tabIndex="-1"
		color="secondary"
		className={className}
		onClick={resetWords}
		size="small">
		<ReplayIcon />
	</Fab>
};