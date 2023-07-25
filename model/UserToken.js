const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userToken = new mongoose.Schema({
	userId: { type: ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 1 * 86400 },
});

module.exports = mongoose.model("usertokens", userToken);
