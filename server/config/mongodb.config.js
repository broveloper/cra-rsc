const bluebird = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = bluebird;
const db = {};
db.User = require('../models/user.model');
db.Passage = require('../models/passage.model');
db.mongoose = mongoose;
db.mongoose
	// .connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?authSource=${process.env.MONGODB_AUTH_SOURCE}&readPreference=primary&ssl=true&retryWrites=true&w=majority`, {
	.connect(`mongodb+srv://admin:2fkoswAJz74rkKPA@rsc.2bivzc3.mongodb.net/?retryWrites=true&w=majority`, {
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