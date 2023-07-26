const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');


const bgate = axios.create({
	baseURL: 'https://www.biblegateway.com', // ?search=Genesis+1&version=NIV
	timeout: 1000,
});
const VERSION = process.env.VERSION || 'NIV';
// const PAUSE = (Math.floor(Math.random() * 2) + 1) * 1000;
const PAUSE = 600;
const PROCESSED = {};
const ERRORS = [];

if (process.env.TEST === 'gc') getChapter(VERSION, { book_id: 'GEN', book_name: 'Genesis' }, 1);
// if (process.env.TEST === 'gc') getChapter(VERSION, { book_id: 'LUK', book_name: 'Luke' }, 9);
// if (process.env.TEST === 'gc') getChapter(VERSION, { book_id: 'PSM', book_name: 'Psalm' }, 23);
else if (process.env.TEST === 'mc') makeChapter(VERSION, { book_id: 'GEN', book_name: 'Genesis' }, 1, path.join(__dirname, VERSION, 'GEN', '1.json'));
else if (process.env.TEST === 'mb') makeBibleFile(VERSION);
else makeBible(VERSION);

function getTextTexts(node) {
	node.find('.chapternum').remove();
	node.find('.crossreference').remove();
	node.find('.footnote').remove();
	node.find('.versenum').remove();
	return node.text().replace(/[\r\n\t]+/g, ' ');
	// return _.chain(node[0]?.children)
	// .filter(node => node.type === 'text')
	// .map(node => node.data.replace(/[\r\n\t]+/g, ' '))
	// .join('')
	// .trim()
	// .value();
}

function mergeType(types, type) {
	return [types, type].filter(t => t).join(' ');
}

async function getChapter(__version, __book, __chapter) {
	const { book_id, book_name } = __book;
	const html = process.env.TEST === 'gc'
		? fs.readFileSync(path.join(__dirname, `${__book.book_id}-${__chapter}.html`), 'utf8')
		: await bgate.get('/passage', { params: { search: `${book_name} ${__chapter}`, version: __version } }).then(res => res.data);
	const $ = cheerio.load(html);
	const $root = __version === 'KJV'
		? $('.text-html')
		: $('.text-html').find('h3').parent();
	const chapter = {
		book_id,
		book_name,
		chapter: __chapter,
		verses: 0,
		content: [],
	};
	$root.children().each(function() {
		const $this = $(this);
		const $texts = $this.find('.text');
		if ($texts.length) {
			if (this.name === 'h3' || $this.find('h3').length) {
				return chapter.content.push({ text: getTextTexts($texts), type: 'heading' });
			}
			if (this.name === 'h4' || $this.find('h4').length) {
				return chapter.content.push({ text: getTextTexts($texts), type: 'title' });
			}
			const meta = {};
			if ($this.hasClass('poetry') || $this.find('.poetry').length)
				meta.type = mergeType(meta.type, 'poetry');

			$texts.each(function (i) {
				$text = $(this);
				const content = {
					text: getTextTexts($text),
					verse: parseInt($text.attr('class').split(' ')?.[1]?.split('-')?.[2]),
					...meta,
				};
				if (chapter.verses !== content.verse)
					chapter.verses++;
				if (i === 0 && chapter.content.length > 0)
					content.type = mergeType(content.type, 'newline');
				chapter.content.push(content);
			});
		}
	});

	if (process.env.TEST === 'gc') {
		console.log(chapter, chapter.content);
	}
	return chapter;
};

async function makeChapter(version, book, chapter, FILE_PATH) {
	const { book_id, book_name } = book;
	console.log(`Fetching: ${book_id} ${chapter} ...`);
	const [chapter_json] = await Promise.all([
		await getChapter(version, book, chapter),
		new Promise(resolve => setTimeout(resolve, PAUSE)),
	]);
	if (process.env.TEST !== 'gc') {
		fs.writeFileSync(FILE_PATH, JSON.stringify(chapter_json, null, 2));
	}
	// console.log(`\tProcessed: ${book_id} ${chapter}, moving to next chapter.`);
};

async function makeBook(version, book, VERSION_DIR) {
	const { book_id, book_name, chapters } = book;
	const BOOK_DIR = path.join(VERSION_DIR, book_id);
	if (!fs.existsSync(BOOK_DIR)) fs.mkdirSync(BOOK_DIR);
	for (let chapter = 1; chapter <= chapters; chapter++) {
		const FILE_PATH = path.join(BOOK_DIR, `${chapter}.json`);
		if (fs.existsSync(FILE_PATH)) {
			// console.log(`Already Processed: ${book_id} ${chapter}, moving to next chapter.`);
			PROCESSED[book_id] = (PROCESSED[book_id] || 0) + 1;
			continue;
		}
		try {
			await makeChapter(version, book, chapter, FILE_PATH);
			PROCESSED[book_id] = (PROCESSED[book_id] || 0) + 1;
		} catch(err) {
			// console.log(`Error Processing: ${book_id} ${chapter}, moving to next chapter.`);
			ERRORS.push(`${book_id} ${chapter}`);
		}
	}
}

async function makeBibleFile(version, VERSION_DIR) {
	const BIBLE_FILE_PATH = path.join(VERSION_DIR, 'books.json');
	if (!fs.existsSync(BIBLE_FILE_PATH) || process.env.TEST === 'mb') {
		const res = await bgate.get('/passage/bcv', { params: { version } });
		const json = _.chain(res.data.data[0])
			.mapKeys('display')
			.mapValues(book => ({
				book_id: book.osis.toUpperCase(),
				book_name: book.display,
				chapters: book.num_chapters,
				testament: book.testament,
			}))
			.value();
		if (process.env.TEST !== 'mb') {
			fs.writeFileSync(BIBLE_FILE_PATH, JSON.stringify(json, null, 2));
		}
	}
	return JSON.parse(fs.readFileSync(BIBLE_FILE_PATH, 'utf8'));
}

async function makeBible(version) {
	const VERSION_DIR = path.join(__dirname, version);
	if (!fs.existsSync(VERSION_DIR)) {
		fs.mkdirSync(VERSION_DIR);
	}
	const books = await makeBibleFile(version, VERSION_DIR);
	for(let i in books) {
		await makeBook(version, books[i], VERSION_DIR);
	}
	console.log('Processed:', _.chain(PROCESSED).mapValues((num, book_id) => {
		const actual = _.find(books, { book_id })?.chapters;
		return [num, actual, num === actual];
	}).value());
	if (ERRORS.length > 0) console.log('Errors', ERRORS);
}
