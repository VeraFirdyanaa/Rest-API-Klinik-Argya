const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
    name : { type: String, required: true, trim: true },
    form : { type: String, required: true, trim: true },
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    expiredDate : { type: Date, required: true, trim: true },
    price : { type: Number, required: true, trim: true },
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('medicine', MedicineSchema);