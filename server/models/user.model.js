const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	version: String,
	recents: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Passage',
	}],
	passages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Passage',
	}],
}, {
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

UserSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model('User', UserSchema);

module.exports = User;