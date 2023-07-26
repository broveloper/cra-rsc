import _ from 'lodash';
import { memo } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useApp } from '@utils/useApp';

export const baseProps = {
	light: {
		palette: {
			type: 'light',
			primary: { main: '#6b8233', contrastText: '#fff' },
			// primary: { main: '#79ae4a', contrastText: '#fff' },
			// secondary: { main: '#7f4aae', contrastText: '#000' },
			secondary: { main: '#aa7b33', contrastText: '#fff' },
		},
	},
	dark: {
		overrides: {
			MuiPaper: {
				root: { boxShadow: 'none !important' },
				..._.chain(Array.from(Array(25)))
					.map((n, i) => {
						if (i < 1) return { border: '1px solid rgba(255,255,255,.12)', backgroundColor: 'transparent' };
						else if (i < 2) return { backgroundColor: 'rgba(255,255,255,.05)' };
						else if (i < 3) return { backgroundColor: 'rgba(255,255,255,.07)' };
						else if (i < 4) return { backgroundColor: 'rgba(255,255,255,.08)' };
						else if (i < 5) return { backgroundColor: 'rgba(255,255,255,.09)' };
						else if (i < 7) return { backgroundColor: 'rgba(255,255,255,.11)' };
						else if (i < 9) return { backgroundColor: 'rgba(255,255,255,.12)' };
						else if (i < 13) return { backgroundColor: 'rgba(255,255,255,.14)' };
						else if (i < 17) return { backgroundColor: 'rgba(255,255,255,.15)' };
						else return { backgroundColor: 'rgba(255,255,255,.16)' };
					})
					.mapKeys((n, i) => `elevation${i}`)
					.value(),
			}
		},
		palette: {
			type: 'dark',
			primary: { main: '#f9aa33', contrastText: '#000' },
			secondary: { main: '#f94733', contrastText: '#000' },
			background: {
				paper: 'transparent',
				default: '#121212',
			},
		},
	}
}

export const baseThemes = {
	light: createMuiTheme(baseProps.light),
	dark: createMuiTheme(baseProps.dark),
};

export const BaseTheme = memo(props => {
	const { theme } = useApp();
	return <ThemeProvider theme={baseThemes[theme]}>
		{props.children}
	</ThemeProvider>;
});
