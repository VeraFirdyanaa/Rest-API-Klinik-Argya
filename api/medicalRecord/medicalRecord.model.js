const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicalRecordSchema = new Schema({
    idMedic : { type: String, required: true, trim: true },
    action : { type: String, required: true, trim: true },
    diagnosis : { type: String, required: true, trim: true }
});

module.exports = mongoose.model('medicalrecord', MedicalRecordSchema);