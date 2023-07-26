const bluebird = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = bluebird;
const db = {};
db.User = require('../models/user.model');
db.Passage = require('../models/passage.model');
db.mongoose = mongoose;
db.mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(() => {
		console.log(`Successfully connect to MongoDB.`);
	})
	.catch(err => {
		console.error(`Connection error`, err);
		process.exit();
	});

module.exports = db;