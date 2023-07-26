import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickAway, useKey, useUpdateEffect } from 'react-use';
import { mountNode } from 'components/App';
import { ScreenTransition } from './ScreenTransition';

export const Screen = forwardRef((props, ref) => {
	const [isIn, setIsIn] = useState(props.in);
	useKey('Escape', () => isIn && setIsIn(false), { event: 'keydown' }, [isIn]);
	useClickAway(ref, () => isIn && setIsIn(false));
	
	useUpdateEffect(() => {
		setIsIn(props.in);
	}, [props.in]);

	const hide = () => isIn && setIsIn(false);
	const show = () => !isIn && setIsIn(true);
	const toggle = () => setIsIn(!isIn);

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