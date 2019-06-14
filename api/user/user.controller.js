const _ = require('lodash');
const Q = require('q');
const User = require('./user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Patient = require('../patient/patient.model');
const Doctor = require('../doctor/doctor.model');
const Nurse = require('../nurse/nurse.model');

process.env.SECRET_KEY = 'secret'

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/users?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    //proses async
    Q.all([
            User.count(), //total data
            User.find().skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, users) {
            res.status(200).json({
                total,
                users
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    User.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, users) {
        if (err) return res.status(500).send(err);

        res.status(200).json(users);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/users/234567890
    User.findOne({
        _id: req.params.id
    }).exec(function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).json({
            message: 'User Not Found! '
        });

        res.status(200).json(user);
    });
};

exports.create = function (req, res) {
    User.create(req.body, function (err, user) {
        if (err) return res.status(500).send(err);

        res.status(201).send(user);
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/users/234567890

    if (req.body._id) delete req.body._id;
    User.findOne({
        _id: req.params.id
    }).exec(function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).json({
            message: 'User Not Found! '
        });

        let updated = _.merge(user, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'User Updated',
                user: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    User.findOne({
        _id: req.params.id
    }).exec(function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).json({
            message: 'User Not Found! '
        });

        user.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}

exports.login = function (req, res) {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                // if (bcrypt.compareSync(req.body.password, user.password)) {
                if (req.body.password === user.password) {
                    const payload = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role
                    }
                    switch (user.role) {
                        case 'patient':
                            Patient.findOne({
                                userId: user._id
                            }).exec(function (err, patient) {

                                if (patient) payload.patient = patient;
                                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                })
                                return res.send({
                                    token: token,
                                    user: payload
                                });
                            });
                            break;
                        case 'doctor':
                            Doctor.findOne({
                                userId: user._id
                            }).exec(function (err, doctor) {

                                if (doctor) payload.doctor = doctor;
                                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                })
                                return res.send({
                                    token: token,
                                    user: payload
                                });
                            });
                            break;
                        default:
                            Nurse.findOne({
                                userId: user._id
                            }).exec(function (err, nurse) {

                                if (nurse) payload.nurse = nurse;
                                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                })
                                res.send({
                                    token: token,
                                    user: payload
                                });
                            });
                    }
                } else {
                    res.json({
                        error: 'Password is invalid'
                    })
                }
            } else {
                res.json({
                    error: 'User does not exist'
                })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
}