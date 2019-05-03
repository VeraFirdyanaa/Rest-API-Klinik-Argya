const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckUpHistorySchema = new Schema({
    idCheckUpHistory : { type: String, required: true, trim: true },
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    idPasien : { type: Schema.Types.ObjectId, required: true, ref: 'patient' },
    idDoctor : { type: Schema.Types.ObjectId, required: true, ref: 'doctor' },
    complaint : {type: Number, required: true, trim: true },
    diagnosisDoctor : {type: String, required: true, trim: true },
    bloodPressure : {type: String, required: true, trim: true },
    weight : {type: Number, required: true, trim: true },
    temperature : {type: String, required: true, trim: true },
});

module.exports = mongoose.model('checkUpHistory', CheckUpHistorySchema);