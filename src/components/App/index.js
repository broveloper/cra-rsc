
import './styles.css';
import Box from '@material-ui/core/Box';
import { Provider } from '@utils/useApp';
import { AppBar } from 'components/AppBar';
import { Recall } from 'components/Recall';
export { AppContainer } from './AppContainer';

export const mountNode = document.getElementById('root');

export const App = () => {
	return <Provider>
		<AppBar />
		<Box
			flex="1"
			position="relative"
			my={2}>
			<Box
				style={{ overflow: 'hidden scroll' }}
				display="flex"
				flexDirection="column"
				width="100%"
				height="100%"
				position="absolute"
				top="0"
				left="0">
				<Recall />
			</Box>
		</Box>
	</Provider>;
};