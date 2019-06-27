const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicalRecordSchema = new Schema({
    createdDate: {
        type: Date,
        required: true,
        trim: true,
        default: new Date()
    },
    patient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'patient'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'doctor'
    },
    complaint: {
        type: String,
        required: true,
        trim: true
    },
    diagnose: {
        type: String,
        required: true,
        trim: true
    },
    bloodPressure: {
        type: Number,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
        required: true,
        trim: true
    },
    temperature: {
        type: String,
        required: true,
        trim: true
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'recipe'
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'queue'
    },
    needOpname: {
        type: Boolean,
        default: false
    },
    opname: {
        type: Schema.Types.ObjectId,
        ref: 'opname'
    }
});

module.exports = mongoose.model('medicalrecord', MedicalRecordSchema);