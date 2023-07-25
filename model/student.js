const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String },
    school_id: { type: ObjectId },
    access_token: { type: String },
    refresh_token: { type: String }
})

module.exports = mongoose.model('students', userSchema)