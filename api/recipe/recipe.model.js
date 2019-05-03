const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
    idDoctor : { type: Schema.Types.ObjectId, required: true, ref: 'doctor' },
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    idPatient : { type: String, required: true, trim: true },
    total : { type: Number, required: true, trim: true },
    details: [
        {
            medicine: { type: Schema.Types.ObjectId, ref: 'medicine' },
            qty: { type: Number, default: 0 }
        }
    ]
});

module.exports = mongoose.model('queue', QueueSchema);