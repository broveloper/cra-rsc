import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './useApp';
import { AuthProvider } from './useAuth';
import { PassageProvider } from './usePassage';
import { ProfileProvider } from './useProfile';
import { ScreenProvider } from './useScreen';
import { WordsProvider } from './useWords';

export { useApp } from './useApp';
export { useAuth } from './useAuth';
export { usePassage } from './usePassage';
export { useProfile } from './useProfile';
export { useScreen } from './useScreen';
export { useWords } from './useWords';

export const Provider = props => {
	return <Router>
		<AppProvider>
			<AuthProvider>
				<ProfileProvider>
					<PassageProvider>
						<ScreenProvider>
							<WordsProvider>
								{props.children}
							</WordsProvider>
						</ScreenProvider>
					</PassageProvider>
				</ProfileProvider>
			</AuthProvider>
		</AppProvider>
	</Router>;
};