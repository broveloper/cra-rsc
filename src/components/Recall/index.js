import Box from '@material-ui/core/Box';
import logger from '@utils/logger';
import { useWords } from '@utils/useApp';
import { AppContainer } from 'components/App';
import { Copyright } from './Copyright';
import { Actions } from './Actions';
import { Words } from './Words';

export const Recall = props => {
	const { inputProps } = useWords();

	return <>
		<Box
			component={AppContainer}
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'hidden scroll' }}
				component={AppContainer}
				display="flex"
				flexDirection="column"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				mt={2}>
				<Box position="relative" onClick={e => inputProps.ref.current?.focus?.()}>
					<Words hint />
					<Words />
				</Box>
				<Copyright />
				{logger.enabled && <pre>{logger.logs}</pre>}
			</Box>
			<Actions />
		</Box>
	</>;
};