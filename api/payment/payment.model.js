const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    idInpatient : { type: String, required: true, trim: true },
    total : { type: String, required: true, trim: true }
});

module.exports = mongoose.model('payment', PaymentSchema);