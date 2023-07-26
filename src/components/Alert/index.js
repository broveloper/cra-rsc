import { createRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { mountNode } from 'components/App';

export const Alert = forwardRef((props, ref) => {
	const {
		autoHideDuration = 6000,
		children,
		alertRef = createRef(),
		open: propOpen = false,
		severity,
		variant = 'filled'
	} = props;
	const [open, setOpen] = useState(propOpen);
	const [message, setMessage] = useState(children);

	const handleClose = (event, reason) => reason !== 'clickaway' && setOpen(false);

	const alert = message => {
		if (message) setMessage(message);
		setOpen(true);
	};

	useImperativeHandle(alertRef, () => ({
		alert,
		setOpen,
	}));

	useEffect(() => {
		if (!open && message !== children) {
			setTimeout(() => setMessage(children), 200);
		}
	}, [open]);

	return createPortal(<Snackbar
		autoHideDuration={autoHideDuration}
		onClose={handleClose}
		open={open}
		ref={ref}>
		<MuiAlert
			elevation={6}
			onClose={handleClose}
			severity={severity}
			variant={variant}>
			{message}
		</MuiAlert>
	</Snackbar>, mountNode);
});
