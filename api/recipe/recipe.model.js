const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    createdDate: {
        type: Date,
        required: true,
        trim: true,
        default: new Date()
    },
    total: {
        type: Number,
        required: true,
        trim: true
    },
    details: [{
        medicine: {
            type: Schema.Types.ObjectId,
            ref: 'medicine'
        },
        qty: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('recipe', RecipeSchema);