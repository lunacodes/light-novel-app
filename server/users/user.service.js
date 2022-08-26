import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import './user.controller.js';

const secret = 'jdhdhd-kjfjdhrhrerj-uurhr-jjge';

// users hardcoded for simplicity, store in a db for production applications
const users = [
	{
		id: 1,
		username: 'test',
		password: 'test',
		firstName: 'Test',
		lastName: 'User',
	},
];

async function authenticate({ username, password }) {
	const user = users.find(
		(u) => u.username === username && u.password === password
	);

	if (!user) throw 'Username or password is incorrect';

	// create a jwt token that is valid for 7 days
	const token = jwt.sign({ sub: user.id }, secret, {
		expiresIn: '7d',
	});

	return {
		...omitPassword(user),
		token,
	};
}

async function getAll() {
	return users.map((u) => omitPassword(u));
}

// helper functions
function omitPassword(user) {
	const { password, ...userWithoutPassword } = user;
	return userWithoutPassword;
}

export default { authenticate, getAll };
