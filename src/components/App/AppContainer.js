import Container from '@material-ui/core/Container';
import { useApp } from '@utils/useApp';

export const AppContainer = props => {
	const {
		children,
		...otherProps
	} = props;
	const { maxWidth } = useApp();
	return <Container
		maxWidth={maxWidth}
		{...otherProps}>
		{props.children}
	</Container>;
};