import { Children, cloneElement, forwardRef } from 'react';
import { Transition } from 'react-transition-group';

export const getScale = value => `scale(${value}, ${value ** 2})`;

export const getTransition = duration => `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;

export const Transitions = forwardRef((props, ref) => {
	const {
		/* Child Container Props */
		className,
		style,
		transitionStyles,
		/* Transition Props */
		nodeRef,
		children,
		in: _in,
		mountOnEnter,
		unmountOnExit,
		appear,
		enter,
		exit,
		addEndListener,
		timeout = 150,
		onEnter,
		onEntering,
		onEntered,
		onExit,
		onExiting,
		onExited,
		...childProps
	} = props;
	return <Transition
		nodeRef={nodeRef}
		children={children}
		in={_in}
		mountOnEnter={mountOnEnter}
		unmountOnExit={unmountOnExit}
		appear={appear}
		enter={enter}
		exit={exit}
		addEndListener={addEndListener}
		timeout={timeout}
		onEnter={onEnter}
		onEntering={onEntering}
		onEntered={onEntered}
		onExit={onExit}
		onExiting={onExiting}
		onExited={onExited} >
		{state => {
			const hidden = state === 'exited' && !props.in;
			return <div
				className={className}
				ref={ref}
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					transition: getTransition(timeout),
					visibility: hidden ? 'hidden' : undefined,
					...transitionStyles[state],
					...style,
				}}>
				{Children.map(children, child => child && cloneElement(child, { ...childProps, transitionRef: ref, transitionState: state }))}
			</div>;
		}}
	</Transition>
});