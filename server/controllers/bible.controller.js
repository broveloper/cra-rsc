const _ = require('lodash');
const fs = require('fs');
const fuzzy = require('fuzzy');
const path = require('path');
const Passage = require('../models/passage.model');
const User = require('../models/user.model');

const VERSIONS_DIR = path.join(__dirname, '..', 'files', 'versions');

const PASSAGE_REGEX = /^\s*(\d?\s*[a-zA-Z]+)\s+(\d+):?(\d+\s*-?\s*\d*)?\s*$/;

const getBible = version => {
	const BIBLE_FILE = path.join(VERSIONS_DIR, version, 'bible.json');
	const bible = JSON.parse(fs.readFileSync(BIBLE_FILE, 'utf8'));
	return bible;
};

const getChapter = (version, book, chapter_num) => {
	const CHAPTER_FILE = path.join(VERSIONS_DIR, version, book, `${chapter_num}.json`);
	const chapter = JSON.parse(fs.readFileSync(CHAPTER_FILE, 'utf8'));
	return chapter;
};

const getVersions = () => {
	const version_dirs = fs.readdirSync(VERSIONS_DIR, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
	const versions = version_dirs.map(dirent => getBible(dirent.name));
	return versions;
};

const getPassage = (options) => {
	const { q, headings, version } = options;
	const bible = getBible(version);
	const books = bible.books;
	const [q_book, q_chapter, q_verses] = q.replace(PASSAGE_REGEX, '$1|$2|$3').split('|');
	const book_name = fuzzy.filter(q_book, Object.keys(books))?.[0]?.string;
	const book = books[book_name];
	const chapter = getChapter(version, book.book_id, q_chapter);
	const final_verse = _.chain(chapter.content).filter(content => content.hasOwnProperty('verse')).last().get('verse').value();
	const chapter_range = [1, final_verse];
	const range = [chapter_range[0], chapter_range[1]];
	let start, end;
	if (q_verses.trim()) {
		const q_range = q_verses.split('-');
		range[0] = parseInt(q_range[0].trim())
		range[1] = q_range[1]?.trim?.() ? parseInt(q_range[1].trim()) : range[0];
		range[1] = Math.max(range[0], range[1]);
		range[1] = Math.min(range[1], chapter_range[1]);
		start = range[0];
		if (q_range.length > 1) end = range[1];
	}
	const meta = _.pick(chapter, ['book_id', 'book_name', 'chapter']);
	const passage = _.chain(chapter.content)
		.filter(content => {
			if (headings && /heading/.test(content.type))
				return true;
			else if (content.verse >= range[0] && content.verse <= range[1])
				return true;
			return false;
		})
		.map(content => Object.assign({}, meta, content))
		.value();

	return [passage, {
		book: chapter.book_name,
		chapter: chapter.chapter,
		passage: _.chain(`${chapter.book_name} ${chapter.chapter}`)
			.thru(bc => {
				if (start) bc += `:${start}`;
				if (end) bc += `-${end}`;
				return bc;
			})
			.value(),
		start,
		end,
		version,
	}];
};

const upsertPassage = async (update) => {
	try {
		const filter = _.pick(update, ['version', 'book', 'chapter', 'start', 'end']);
		const opts = { new: true, upsert: true };
		const passage = await Passage.findOneAndUpdate(filter, update, opts);
		return passage;
	} catch (err) {
		console.log('Error attempting to upsert passage.')
	}
};


exports.getVersions = (req, res) => {
	try {
		const versions = getVersions();
		res.status(200).send(versions);
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.getBible = (req, res) => {
	try {
		const bible = getBible(req.params.version);
		res.status(200).send(bible);
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.getChapter = async (req, res) => {
	try {
		const { version, bookname, chapternum } = req.params;
		const bible = getBible(version);
		const books = bible.books;
		const book_name = fuzzy.filter(bookname, Object.keys(books))?.[0]?.string;
		const book = books[book_name];
		const { content, ...chapter } = getChapter(version, book.book_id, chapternum);
		res.status(200).send(chapter);
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.getPassage = async (req, res) => {
	try {
		const { version } = req.params;
		const { q, headings } = req.query;
		const [passage, meta] = getPassage({ headings, q: q.trim(), version });
		res.status(200).send(passage);
		if (req.userId) {
			const user = await User.findById(req.userId);
			if (!user) return console.log(`No user found for id (${req.userId})`);

			const passage = await upsertPassage(meta);
			if (user.recents?.[0]?.toString?.() !== passage.id) {
				user.recents = _.chain(user.recents)
					.map(id => id.toString())
					.unshift(passage.id)
					.uniq()
					.slice(0, 15)
					.value();
				await user.save();
			}
		}
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.bookmarkPassage = async (req, res) => {
	try {
		const { userId } = req;
		const user = await User.findById(userId);
		if (!user) throw new Error(`No user found for id (${userId})`);

		const { passage: q, version } = req.body;
		const [, meta] = await getPassage({ q, version });
		const passage = await upsertPassage(meta);

		user.passages = _.chain(user.passages)
			.map(id => id.toString())
			.unshift(passage.id)
			.uniq()
			.slice(0, 25)
			.value();
		await user.save();
		res.status(200).send({ message: 'Successfully bookmarked.' })
	} catch (err) {
		res.status(500).send({ message: err });
	}
};