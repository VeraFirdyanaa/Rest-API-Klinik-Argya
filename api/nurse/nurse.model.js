const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NurseSchema = new Schema({
    name : { type: String, required: true, trim: true },
    address : { type: String, required: true, trim: true },
    noTelp : { type: String, required: true, trim: true },
    gender : { type: String, enum: ['Pria', 'Wanita'], required: true },
    pob : { type: String, required: true, trim: true },
    dob : { type: String, required: true, trim: true },
    age : {type: Number, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('nurse', NurseSchema);