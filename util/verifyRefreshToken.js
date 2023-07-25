const jwt = require('jsonwebtoken');
const UserToken = require('../model/UserToken');

const verifyRefreshToken = async (refreshToken) => {

	const newrefreshToken = refreshToken.refreshToken;

	const doc = await UserToken.findOne({ token: newrefreshToken});

	if (!doc)
		return reject({ error: true, message: "Invalid refresh token" });

	try {
		const tokenDetails = jwt.verify(newrefreshToken, process.env.REFRESH_TOKEN_KEY)
		// console.log(tokenDetails);
		return Promise.resolve(tokenDetails);
	}
	catch(err){
		return res.status(401).send("Invalid Token")
	}
};

module.exports = verifyRefreshToken;