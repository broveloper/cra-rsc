const {
	detectTokenUser,
	verifyToken,
} = require('../middlewares/authJwt');

const {
	bookmarkPassage,
	getBible,
	getChapter,
	getPassage,
	getVersions,
} = require('../controllers/bible.controller');

module.exports = app => {
	app.get('/v1/versions', [detectTokenUser], getVersions);

	app.get('/v1/bible/:version', [detectTokenUser], getBible);

	app.get('/v1/:version/:bookname/:chapternum', [detectTokenUser], getChapter);
	
	app.get('/v1/:version/passage', [detectTokenUser], getPassage);
	
	app.post('/v1/bookmark/passage', [verifyToken], bookmarkPassage);
};