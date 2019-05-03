const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : { type: String, required: true, trim: true },
    password : { type: String, required: true, trim: true },
    role : { type: Number, required: true, trim: true }
});

module.exports = mongoose.model('user', UserSchema);