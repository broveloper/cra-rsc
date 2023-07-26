const mongoose = require('mongoose');

const PassageSchema = new mongoose.Schema({
	book: String,
	chapter: Number,
	passage: String,
	start: Number,
	end: Number,
	version: String,
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

PassageSchema.index({ version: 1, book: 1, chapter: 1, start: 1, end: 1 }, { unique: true })

const Passage = mongoose.model('Passage', PassageSchema);

module.exports = Passage;