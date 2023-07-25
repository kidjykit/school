const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    school_id: { type: String },
    school_name: { type: String, default: null }
})

module.exports = mongoose.model('schools', userSchema)