const { checkDuplicateEmail } = require('../middlewares/verifySignUp');
const {
	signin,
	signup,
	test,
} = require('../controllers/auth.controller');

module.exports = app => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});

	app.post('/v1/auth/signup', [checkDuplicateEmail], signup);

	app.post('/v1/auth/signin', signin);

	app.use('/v1/auth/test', test);
};