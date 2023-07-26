const jwt = require('jsonwebtoken');

exports.detectTokenUser = async (req, res, next) => {
	try {
		let token = req.headers['x-access-token'];

		if (!token || token === 'null') {
			return next();
		}

		const decoded = await jwt.verify(token, process.env.AUTH_SECRET)
		req.userId = decoded.id;
		next();
	} catch (err) {
		console.log(err);
		next();
	}
};

exports.verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send({ message: 'No token provided!' });
	}

	jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: 'Unauthorized!' });
		}
		req.userId = decoded.id;
		next();
	});
};
