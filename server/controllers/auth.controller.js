const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

const generateToken = (data, expiresIn = 86400) => jwt.sign(data, process.env.AUTH_SECRET, { expiresIn });

exports.signup = async (req, res) => {
	try {
		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8),
		});
		const { _id: id, email } = await user.save();
		
		const token = generateToken({ id, email });
		res.status(200).send({
			accessToken: token,
			message: 'User was registered successfully!',
		});
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.signin = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).send({ message: 'User Not found.' });
		}

		if (!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(401).send({ accessToken: null, message: 'Invalid Email or Password!' });
		}

		const { _id: id, email } = user;

		const token = generateToken({ id, email });
		res.status(200).send({
			accessToken: token,
			message: 'User signin is successful!'
		});
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.test = async (req, res) => {
	try {
		const token = generateToken(req.body);
		console.log('Token:', token);
		res.status(200).send({
			accessToken: token,
		});
	} catch (err) {
		res.status(500).send({ message: err });
	}
};