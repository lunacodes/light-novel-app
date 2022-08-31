import express from 'express';
import Joi from '@hapi/joi';
import validateRequest from '../middleware/validate-request.js';
import authorize from '../middleware/authorize.js';
import Role from '../_helpers/role.js';
import userService from './user.service.js';
const UserRouter = express.Router();

// routes
UserRouter.post('/users/authenticate', authenticateSchema, authenticate);
UserRouter.post('/users/refresh-token', refreshToken);
UserRouter.post(
	'/users/revoke-token',
	authorize(),
	revokeTokenSchema,
	revokeToken
);
UserRouter.post('/users/signup/', registerUser);

// authorize() = all logged in users
// omit authorize() to allow for public access
UserRouter.get('/users', authorize(Role.Admin), getAll);
UserRouter.get('/users/all', authorize(Role.Admin), getAll);
UserRouter.get('/users/:id', authorize(), getById);
UserRouter.get('/users/:id/refresh-tokens', authorize(), getRefreshTokens);

function registerUser(req, res, next) {
	const userObj = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: req.body.password,
	};
	userService.registerUser(userObj, res, next);
}

function authenticateSchema(req, res, next) {
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	});
	validateRequest(req, next, schema);
}
function authenticate(req, res, next) {
	const { username, password } = req.body;
	const ipAddress = req.ip;

	userService
		.authenticate({ username, password, ipAddress })
		.then(({ refreshToken, ...user }) => {
			setTokenCookie(res, refreshToken);
			const usrmsg = JSON.stringify(user.username);
			console.log(`logged in username: ${usrmsg}`);
			res.json(user);
		})
		.catch(next);
}

function refreshToken(req, res, next) {
	const token = req.cookies.refreshToken;
	const ipAddress = req.ip;

	userService
		.refreshToken({ token, ipAddress })
		.then(({ refreshToken, ...user }) => {
			setTokenCookie(res, refreshToken);
			res.json(user);
		})
		.catch(next);
}

function revokeTokenSchema(req, res, next) {
	const schema = Joi.object({
		token: Joi.string().empty(''),
	});
	validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
	// accept token from request body or cookie
	const token = req.body.token || req.cookies.refreshToken;
	const ipAddress = req.ip;

	if (!token) return res.status(400).json({ message: 'Token is required' });

	// users can revoke their own tokens and admins can revoke any tokens
	if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	userService
		.revokeToken({ token, ipAddress })
		.then(() => res.json({ message: 'Token revoked' }))
		.catch(next);
}
function getAll(req, res, next) {
	userService
		.getAll()
		.then((users) => res.json(users))
		.catch(next);
}

function getById(req, res, next) {
	// regular users can get their own record and admins can get any record
	if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	userService
		.getById(req.params.id)
		.then((user) => (user ? res.json(user) : res.sendStatus(404)))
		.catch(next);
}

function getRefreshTokens(req, res, next) {
	// users can get their own refresh tokens and admins can get any user's refresh tokens
	if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	userService
		.getRefreshTokens(req.params.id)
		.then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
		.catch(next);
}

// helper functions
function setTokenCookie(res, token) {
	// create http only cookie with refresh token that expires in 7 days
	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	};
	res.cookie('refreshToken', token, cookieOptions);
}

export default UserRouter;
