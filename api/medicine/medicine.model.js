const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
    name : { type: String, required: true, trim: true },
    form : { type: String, required: true, trim: true },
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    price : { type: Number, required: true, trim: true }
});

module.exports = mongoose.model('medicine', MedicineSchema);