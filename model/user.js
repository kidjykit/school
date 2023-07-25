const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String },
    school_id: { type: ObjectId },
    address: { type: String, default: null },
    profile_image: { type: String, default: null },
    gender: { type: String, default: null },
    citizen_id: { type: String, default: null },
    phone: { type: String, default: null },
    role: { type: String, default: null },
    job_title: { type: String, default: null },
    token: { type: String }
})

module.exports = mongoose.model('users', userSchema)