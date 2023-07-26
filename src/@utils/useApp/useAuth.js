import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

const ACCESS_TOKEN_KEY = 'memo.token';
const emailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // eslint-disable-line
const passwordregex = /^[^\s\t\n\r]{8,}$/; // 8 characters, 1 letter, 1 number

const Context = createContext(null);

export const useAuth = () => useContext(Context);

export const AuthProvider = props => {
	const [token, setToken, removeToken] = useLocalStorage(ACCESS_TOKEN_KEY, null);

	const {
		signin,
		signout,
		signup,
		user,
	} = useMemo(() => {
		const memoized = {};
		const sign = async (endpoint, email, password) => {
			if (!passwordregex.test(password)) throw new Error('Invalid password. Minimum eight characters, at least one letter and one number.');
			if (!emailregex.test(email)) throw new Error('Invalid email.');
			const res = await axios.post(endpoint, { email, password });
			if (!res.data?.accessToken) throw new Error('Authentication error.');
			setToken(res.data.accessToken);
			return jwt.decode(res.data.accessToken);
		};

		memoized.signin = async (email, password) => await sign('/v1/auth/signin', email, password);

		memoized.signup = async (email, password) => await sign('/v1/auth/signup', email, password);

		memoized.signout = () => removeToken();

		memoized.user = token ? jwt.decode(token) : null;

		return memoized;
	}, [token]);

	const state = {
		emailregex,
		passwordregex,
		removeToken,
		setToken,
		signin,
		signout,
		signup,
		token,
		user,
	};

	return <Context.Provider value={state}>
		{props.children}
	</Context.Provider>;
};