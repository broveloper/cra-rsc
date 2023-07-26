import { createContext, createRef, useContext, useMemo, useRef } from 'react';
import {
	Bookmarks,
	SearchPassage,
	SearchVersion,
	Signin,
} from 'components/Screen';
import { useProfile } from './useProfile';

const Context = createContext(null);

export const useScreen = () => useContext(Context);

export const ScreenProvider = props => {
	const { profile } = useProfile();
	const screenRefs = useRef({
		bookmarks: createRef(),
		recents: createRef(),
		searchPassage: createRef(),
		searchVersion: createRef(),
		signin: createRef(),
	});
	const state = useMemo(() => ({
		get bookmarks() { return screenRefs.current.bookmarks.current },
		get recents() { return screenRefs.current.recents.current },
		get searchPassage() { return screenRefs.current.searchPassage.current },
		get searchVersion() { return screenRefs.current.searchVersion.current },
		get signin() { return screenRefs.current.signin.current },
	}), [profile]);
	return <Context.Provider value={state}>
		{props.children}
		<Bookmarks ref={screenRefs.current.bookmarks} />
		<SearchVersion ref={screenRefs.current.searchVersion} />
		<SearchPassage ref={screenRefs.current.searchPassage} />
		<Signin ref={screenRefs.current.signin} />
	</Context.Provider>;
};