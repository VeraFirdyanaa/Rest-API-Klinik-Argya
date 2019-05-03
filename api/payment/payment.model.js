const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    createdDate : { type: Date, required: true, trim: true, default: new Date() },
    idInpatient : { type: Schema.Types.ObjectId, required: true, ref: 'inpatient' },
    idRecipe : { type: Schema.Types.ObjectId, required: true, ref: 'recipe' },
    total : { type: String, required: true, trim: true }
});

module.exports = mongoose.model('payment', PaymentSchema);