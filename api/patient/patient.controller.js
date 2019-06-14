const _ = require('lodash');
const Q = require('q');
const Patient = require('./patient.model');
const User = require('../user/user.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/patients?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    //proses async
    Q.all([
            Patient.count(), //total data
            Patient.find().skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, patients) {
            res.status(200).json({
                total,
                patients
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Patient.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, patients) {
        if (err) return res.status(500).send(err);

        res.status(200).json(patients);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/patients/234567890
    Patient.findOne({
        _id: req.params.id
    }).exec(function (err, patient) {
        if (err) return res.status(500).send(err);
        if (!patient) return res.status(404).json({
            message: 'Patient Not Found! '
        });

        res.status(200).json(patient);
    });
};

exports.create = function (req, res) {
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        role: 'patient'
    }
    User.create(newUser, function (err, user) {
        if (err) return res.status(500).send(err);

        req.body.userId = user._id;
        Patient.create(req.body, function (err, patient) {
            if (err) return res.status(500).send(err);

            res.status(201).send(patient);
        });
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/patients/234567890

    if (req.body._id) delete req.body._id;
    Patient.findOne({
        _id: req.params.id
    }).exec(function (err, patient) {
        if (err) return res.status(500).send(err);
        if (!patient) return res.status(404).json({
            message: 'Patient Not Found! '
        });

        let updated = _.merge(patient, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Patient Updated',
                patient: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Patient.findOne({
        _id: req.params.id
    }).exec(function (err, patient) {
        if (err) return res.status(500).send(err);
        if (!patient) return res.status(404).json({
            message: 'Patient Not Found! '
        });

        patient.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}