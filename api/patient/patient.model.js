const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    name : { type: String, required: true, trim: true },
    work : { type: String, required: true, trim: true },
    address : { type: String, required: true, trim: true },
    noTelp : { type: String, required: true, trim: true },
    gender : { type: String, enum: ['Pria', 'Wanita'], required: true },
    pob : { type: String, required: true, trim: true },
    dob : { type: String, required: true, trim: true },
    age : {type: Number, required: true, trim: true },
    complaint : {type: Number, required: true, trim: true }
});

module.exports = mongoose.model('patient', PatientSchema);