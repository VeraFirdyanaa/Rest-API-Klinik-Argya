const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    idRoom : { type: String, required: true, trim: true },
    name : { type: String, required: true, trim: true },
    capacity : { type: String, required: true, trim: true },
    price : { type: Number, required: true, trim: true }
});

module.exports = mongoose.model('room', RoomSchema);