const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
    idQueue : { type: String, required: true, trim: true },
    timeQueue : { type: Date, required: true, trim: true, default: new Date() },
    timeCome : { type: Date, required: true, trim: true },
    name : { type: String, required: true, trim: true },
    work : { type: String, required: true, trim: true },
    gender : { type: String, enum: ['Pria', 'Wanita'], required: true },
    address : { type: String, required: true, trim: true },
    pob : { type: String, required: true, trim: true },
    dob : { type: String, required: true, trim: true },
    age : {type: Number, required: true, trim: true },
    age : {type: Number, required: true, trim: true },
    complaint : {type: Number, required: true, trim: true },
    noInduk : { type: String, required: true, trim: true }
});

module.exports = mongoose.model('queue', QueueSchema);