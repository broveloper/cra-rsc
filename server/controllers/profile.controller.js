const User = require('../models/user.model')

exports.profile = async (req, res) => {
	try {
		const user = await User.findById(req.userId)
			.select('-_id email name recent passages version')
			.populate({ path: 'recents', select: 'passage version' })
			.populate({ path: 'passages', select: 'passage version' });
		res.status(200).send(user)
	} catch (err) {
		res.status(500).send({ message: err });
	}
};
