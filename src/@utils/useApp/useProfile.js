import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@utils/useApp';

const Context = createContext(null);

export const useProfile = () => useContext(Context);

export const ProfileProvider = props => {
	const {
		removeToken,
		token,
	} = useAuth();
	const [profile, setProfile] = useState(null);

	const {
		bookmarkPassage,
		getProfile,
	} = useMemo(() => {
		const request = axios.create({
			timeout: 1000,
			headers: { 'x-access-token': token },
		});
		const memoized = {};
		memoized.getProfile = async () => {
			try {
				const res = await request.get('/v1/profile');
				setProfile(res.data);
			} catch (err) {
				removeToken();
			}
		};

		memoized.bookmarkPassage = async (passage, version) => {
			const res = await request.post('/v1/bookmark/passage', { passage, version })
			setProfile(res.data);
		};

		return memoized;
	}, [token]);

	useEffect(() => {
		if (token)
			getProfile();
		else if (profile !== null)
			setProfile(null);
	}, [token]);

	const state = {
		bookmarkPassage,
		getProfile,
		profile,
	};

	return <Context.Provider value={state}>
		{token && !profile ? null : props.children}
	</Context.Provider>;
};