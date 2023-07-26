import { forwardRef } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
	getScale,
	Transitions,
} from 'components/Transitions';

export const ScreenTransition = forwardRef((props, ref) => {
	const theme = useTheme();
	return <Transitions
		{...props}
		ref={ref}
		renderHidden={true}
		style={{
			backgroundColor: theme.palette.background.default,
			zIndex: theme.zIndex.modal,
		}}
		transitionStyles={{
			entering: {
				opacity: 0,
				transform: getScale(.95),
			},
			entered: {
				opacity: 1,
				transform: 'none',
			},
			exiting: {
				opacity: 0,
				transform: getScale(1.05),
			},
			exited: {
				opacity: 0,
				transform: 'none',
			},
		}} />;
});
