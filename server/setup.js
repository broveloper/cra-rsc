const bodyParser = require('body-parser');
const cors = require('cors');
require('./config/mongodb.config');

module.exports = app => {
	app.use(cors());

	app.use(bodyParser.json()); // parse requests of content-type - application/json

	app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});

	require('./routes/auth.routes')(app);
	require('./routes/bible.routes')(app);
	require('./routes/profile.routes')(app);
};