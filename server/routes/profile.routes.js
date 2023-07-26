const { verifyToken } = require('../middlewares/authJwt');
const {
	profile,
} = require('../controllers/profile.controller');

module.exports = app => {
	app.get('/v1/profile', [verifyToken], profile);
};