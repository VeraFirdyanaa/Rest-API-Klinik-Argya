const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    code: {
        type: String,
        trim: true
    },
    createdDate: {
        type: Date,
        required: true,
        trim: true,
        default: new Date()
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'recipe'
    },
    medicalRecord: {
        type: Schema.Types.ObjectId,
        ref: 'medicalrecord'
    },
    total: {
        type: String,
        required: true,
        trim: true
    }
});

PaymentSchema.pre('save', function (next) {
    var tgl = new Date();
    var startDate = new Date(tgl.getFullYear(), tgl.getMonth(), 1, 0, 0, 1);
    var endDate = new Date(tgl.getFullYear(), tgl.getMonth() + 1, 0, 23, 59, 59);
    // var dt = new Date(tgl.getFullYear(), tgl.getMonth(), tgl.getDate());
    console.log(this);
    if (this.isNew) {
        var self = this;
        mongoose.model('payment', PaymentSchema).count({
            createdDate: {
                $gte: startDate,
                $lte: endDate
            }
        }, function (err, count) {
            console.log('total Data: ', startDate, endDate, count);
            var nextCode = "" + (count + 1);
            var code = 'TRX' + (tgl.getMonth() + 1) + '-' + '0000';
            var codeSupplier = code.substr(0, code.length - nextCode.length) + nextCode;
            self.code = codeSupplier;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('payment', PaymentSchema);