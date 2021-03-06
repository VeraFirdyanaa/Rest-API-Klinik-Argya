const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InPatientSchema = new Schema({
    noReg : { type: String, required: true, trim: true },
    idDoctor : { type: Schema.Types.ObjectId, required: true, ref: 'doctor' },
    idRoom : { type: Schema.Types.ObjectId, required: true, ref: 'room' },
    idPatient : { type: Schema.Types.ObjectId, required: true, ref: 'patient' },
    createdDate : { type: Date, required: true, trim: true, default: new Date() }
});

module.exports = mongoose.model('inpatient', InPatientSchema);