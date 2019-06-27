const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomType: { type: String, trim: true, required: true },
    roomCapacity: { type: Number, default: 0 },
    roomStatus: { type: String, enum: ["available", "full"], default: "available" },
    hospitalized: [{ type: Schema.Types.ObjectId, ref: 'opname' }],
    images: [{
        type: String
    }],
    roomRates: { type: Number, default: 0 }
});

module.exports = mongoose.model('room', RoomSchema);