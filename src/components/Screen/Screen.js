import { forwardRef, useEffect, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useClickAway, useKey, useUpdateEffect } from 'react-use';
import { mountNode } from 'components/App';
import { ScreenTransition } from './ScreenTransition';

export const Screen = forwardRef((props, ref) => {
	const history = useHistory();
	const [isIn, setIsIn] = useState(props.in);
	const hide = () => {
		if (isIn) {
			flushSync(() => setIsIn(false))
			history.push('/');
		}
	};
	const show = () => !isIn && setIsIn(true);
	const toggle = () => isIn ? hide() : show();
	useKey('Escape', hide, { event: 'keydown' }, [isIn]);
	useClickAway(ref, hide);
	
	useUpdateEffect(() => {
		if (props.in) {
			show();
		} else {
			hide();
		}
	}, [props.in]);

	useEffect(() => {
		Object.assign(ref?.current || {}, { hide, show, toggle });
	}, []);

	return createPortal(<ScreenTransition
		{...props}
		hide={hide}
		in={isIn}
		ref={ref}
		show={show}
		toggle={toggle} />, mountNode);
});