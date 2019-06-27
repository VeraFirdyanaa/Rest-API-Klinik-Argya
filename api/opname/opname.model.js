const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OpanameSchema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'patient' },
    medicalRecord: { type: Schema.Types.ObjectId, ref: 'medicalrecord' },
    room: { type: Schema.Types.ObjectId, ref: 'room' },
    checkIn: { type: Date, default: new Date() },
    checkOut: { type: Date }
});

module.exports = mongoose.model('opname', OpanameSchema);