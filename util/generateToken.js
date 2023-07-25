const jwt = require('jsonwebtoken');
const UserToken = require('../model/UserToken');

const generateTokens = async (user) => {
	try {
		const payload = { user_id: user._id, email: user.email, school_id: user.school_id };
		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_KEY,
			{ expiresIn: "15m" }
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.REFRESH_TOKEN_KEY,
			{ expiresIn: "1d" }
		);

		const userToken = await UserToken.findOne({ userId: user._id });
        console.log(user._id);
		if (userToken) await UserToken.findOneAndDelete({ userId: user._id });

		await new UserToken({ userId: user._id, token: refreshToken }).save();
        // console.log({ accessToken, refreshToken });
		return Promise.resolve({ accessToken, refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports = generateTokens;