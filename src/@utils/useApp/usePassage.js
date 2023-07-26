import _ from 'lodash';
import axios from 'axios';
import fuzzy from 'fuzzy';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth, useProfile } from '@utils/useApp';

const validregex = /^\s*(\d?\s*[a-zA-Z]*)(?:\s+(\d+))?:?(\d+\s*-?\s*\d*)?\s*$/;
const matchregex = /^\s*(\d?\s*[a-zA-Z]*)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;

const Context = createContext(null);

export const getSearchPassageMeta = q => q.replace(matchregex, '$1|$2|$3').split('|').map(meta => meta.trim());

export const getSearchBookName = q => q.replace(matchregex, '$1').trim();

export const isSearchValid = q => validregex.test(q);

export const usePassage = () => useContext(Context);

export const PassageProvider = props => {
	const { token } = useAuth();
	const { profile } = useProfile();
	const [passage, setPassageState] = useState('');
	const [verses, setVerses] = useState(null);
	const [versions, setVersions] = useState(null);
	const [version, setVersionState] = useState(null);
	const {
		bible,
		booknames,
		getBooksBySearch,
		getChapter,
		getPassage,
		getVersions,
		setPassage,
		setPassageVersion,
		setVersion,
	} = useMemo(() => {
		const memoized = {};
		const request = axios.create({
			timeout: 1000,
			headers: { 'x-access-token': token },
		});

		memoized.getVersions = async () => {
			const res = await request.get('/v1/versions');
			const versions = _.mapKeys(res.data, 'id');
			setVersions(versions);
		};

		memoized.getPassage = async (q, v) => {
			const res = await request.get(`/v1/${v || version}/passage`, { params: { q } })
			const verses = res.data;
			return verses;
		};

		memoized.getChapter = async (b, c, v) => {
			const res = await request.get(`/v1/${v || version}/${b}/${c}`);
			const chapter = res.data;
			return chapter;
		};

		memoized.setPassage = async q => {
			if (passage !== q) {
				const verses = await getPassage(q);
				setPassageState(q);
				setVerses(verses);
			}
		};

		memoized.setPassageVersion = async (q, v) => {
			if (passage !== q || version !== v) {
				setVersionState(v);
				const verses = await getPassage(q, v);
				setPassageState(q);
				setVerses(verses);
			}
		};

		memoized.setVersion = version => {
			setPassageState('');
			setVersionState(version);
		};

		memoized.bible = versions?.[version];
		memoized.booknames = Object.keys(memoized.bible?.books || {});

		memoized.getBooksBySearch = q => {
			const qbookname = getSearchBookName(q);
			const qbooks = _.map(fuzzy.filter(qbookname, booknames), ({ original }) => memoized.bible?.books?.[original]);
			return qbooks;
		};

		return memoized;
	}, [token, passage, version, versions]);

	useEffect(() => {
		getVersions();
		if (profile?.recents?.[0]) setPassageVersion(profile.recents[0].passage, profile.recents[0].version);
		else setPassageVersion('James 1:1-10', 'ESV');
	}, []);

	const state = {
		bible,
		booknames,
		getBooksBySearch,
		getChapter,
		getPassage,
		getSearchBookName,
		getSearchPassageMeta,
		getVersions,
		isSearchValid,
		passage,
		setPassage,
		setPassageVersion,
		setVersion,
		verses,
		version,
		versions,
	};

	return <Context.Provider value={state}>
		{versions && props.children}
	</Context.Provider>
};