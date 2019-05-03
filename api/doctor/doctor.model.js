const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    idDoctor : { type: String, required: true, trim: true },
    name : { type: String, required: true, trim: true },
    address : { type: String, required: true, trim: true },
    noTelp : { type: String, required: true, trim: true },
    gender : { type: String, enum: ['Pria', 'Wanita'], required: true },
    specialist : { type: String, required: true, trim: true },
    email : { type: String, required: true, trim: true },
    rates : { type: Number, required: true, trim: true },
    userId : { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('doctor', DoctorSchema);