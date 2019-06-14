const _ = require('lodash');
const Q = require('q');
const Doctor = require('./doctor.model');
const User = require('../user/user.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/doctors?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    //proses async
    Q.all([
            Doctor.count(), //total data
            Doctor.find().populate('userId').skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, doctors) {
            res.status(200).json({
                total,
                doctors
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Doctor.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, doctors) {
        if (err) return res.status(500).send(err);

        res.status(200).json(doctors);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/doctors/234567890
    Doctor.findOne({
        _id: req.params.id
    }).exec(function (err, doctor) {
        if (err) return res.status(500).send(err);
        if (!doctor) return res.status(404).json({
            message: 'Doctor Not Found! '
        });

        res.status(200).json(doctor);
    });
};

exports.create = function (req, res) {
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        role: 'doctor'
    }
    User.create(newUser, function (err, user) {
        if (err) return res.status(500).send(err);

        req.body.userId = user._id;
        Doctor.create(req.body, function (err, doctor) {
            if (err) return res.status(500).send(err);

            res.status(201).send(doctor);
        });
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/doctors/234567890

    if (req.body._id) delete req.body._id;
    Doctor.findOne({
        _id: req.params.id
    }).exec(function (err, doctor) {
        if (err) return res.status(500).send(err);
        if (!doctor) return res.status(404).json({
            message: 'Doctor Not Found! '
        });

        let updated = _.merge(doctor, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Doctor Updated',
                doctor: updated
            });
        });
    });
}

exports.destroy = function (req, res) {
    Doctor.findOne({
        _id: req.params.id
    }).exec(function (err, doctor) {
        if (err) return res.status(500).send(err);
        if (!doctor) return res.status(404).json({
            message: 'Doctor Not Found! '
        });
        
        User.findOneAndRemove({ _id: doctor.userId }, function(err, userDeleted){
            if(err) return res.status(500).send(err);
            doctor.remove(function (err) {
                if (err) return res.status(500).send(err);

                res.status(200).json({
                    massage: 'Job Deleted!'
                });
            });
        });
    });
}