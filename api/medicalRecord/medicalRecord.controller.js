const _ = require('lodash');
const Q = require('q');
const MedicalRecord = require('./medicalRecord.model');
const Recipe = require('../recipe/recipe.model');
const Payment = require('../payment/payment.model');
const Doctor = require('../doctor/doctor.model');
const Queue = require('../queue/queue.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/medicalRecords?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    //proses async
    Q.all([
            MedicalRecord.count(), //total data
            MedicalRecord.find().populate('appointment').skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, medicalRecords) {
            res.status(200).json({
                total,
                medicalRecords
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    MedicalRecord.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, medicalRecords) {
        if (err) return res.status(500).send(err);

        res.status(200).json(medicalRecords);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/medicalRecords/234567890
    MedicalRecord.findOne({
        _id: req.params.id
    }).populate('appointment recipe doctor patient').lean().exec(function (err, medicalRecord) {
        if (err) return res.status(500).send(err);
        if (!medicalRecord) return res.status(404).json({
            message: 'MedicalRecord Not Found! '
        });
        Q.all([Payment.findOne({
                medicalRecord: req.params.id
            }).exec(), Recipe.findOne({
                _id: medicalRecord.recipe
            }).populate('details.medicine').exec()])
            .spread(function (payment, recipe) {
                medicalRecord.payment = payment ? payment : {
                    details: [],
                    total: 0,
                    createdDate: new Date()
                };
                if (recipe) medicalRecord.recipe = recipe;
                res.status(200).json(medicalRecord);
            })
            .catch(err => {
                if (err) return res.status(500).send(err);
            });
    });
};

exports.create = function (req, res) {
    if (req.body.recipe) {
        Recipe.create(req.body.recipe, function (err, recipe) {
            if (err) return res.status(500).send(err);

            var mr = req.body.medicalRecord;
            mr.recipe = recipe._id;
            MedicalRecord.create(mr, function (err, medicalRecord) {
                if (err) return res.status(500).send(err);

                makePayment(recipe.total, medicalRecord, recipe._id, req.body.consultationFee, function (err, payment) {
                    if (err) return res.status(500).send(err);

                    changeAppointment(medicalRecord, function (err, appointment) {
                        res.status(200).json({
                            message: 'Medical Record Saved with Recipe!',
                            medicalRecord: medicalRecord,
                            recipe: recipe,
                            payment: payment
                        });
                    });
                });
            });
        });
    } else {
        MedicalRecord.create(req.body.medicalRecord, function (err, medicalRecord) {
            if (err) return res.status(500).send(err);

            makePayment(null, medicalRecord, null, req.body.consultationFee, function (err, payment) {
                if (err) return res.status(500).send(err);

                changeAppointment(medicalRecord, function (err, appointment) {
                    res.status(200).json({
                        message: 'Medical Record Saved!',
                        medicalRecord: medicalRecord,
                        payment: payment
                    });
                });
            })
        });
    }
}

function makePayment(total, medicalRecord, recipe, consultationFee, cb) {
    Doctor.findOne({
        _id: medicalRecord.doctor
    }).exec(function (err, doctor) {
        console.log('doctor founded', doctor, consultationFee);
        var fee = 0;
        if (consultationFee == true && !doctor) fee += 15000;
        if (consultationFee == true && doctor) fee += doctor.rates;

        var newPayment = {
            total: fee + total,
            medicalRecord: medicalRecord._id,
            recipe
        };
        Payment.create(newPayment, function (err, payment) {
            if (err) return cb(err, null);

            cb(null, payment);
        });
    });
}

function changeAppointment(medicalRecord, cb) {
    Queue.update({
        _id: medicalRecord.appointment
    }, {
        $set: {
            medicalRecord: medicalRecord._id
        }
    }, function (err, updated) {
        if (err) {
            console.log(err);
            return cb(err, null);
        }

        cb(null, updated);
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/medicalRecords/234567890

    if (req.body._id) delete req.body._id;
    MedicalRecord.findOne({
        _id: req.params.id
    }).exec(function (err, medicalRecord) {
        if (err) return res.status(500).send(err);
        if (!medicalRecord) return res.status(404).json({
            message: 'MedicalRecord Not Found! '
        });

        let updated = _.merge(medicalRecord, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'MedicalRecord Updated',
                medicalRecord: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    MedicalRecord.findOne({
        _id: req.params.id
    }).exec(function (err, medicalRecord) {
        if (err) return res.status(500).send(err);
        if (!medicalRecord) return res.status(404).json({
            message: 'MedicalRecord Not Found! '
        });

        medicalRecord.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}