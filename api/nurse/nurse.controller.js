const _ = require('lodash');
const Q = require('q');
const Nurse = require('./nurse.model');
const User = require('../user/user.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/nurses?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    let query = {
        name: {
            $regex: req.query.name || '',
            $options: 'i'
        }
    };

    //proses async
    Q.all([
            Nurse.count(query), //total data
            Nurse.find(query).sort('name').skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, nurses) {
            res.status(200).json({
                total,
                nurses
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Nurse.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, nurses) {
        if (err) return res.status(500).send(err);

        res.status(200).json(nurses);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/nurses/234567890
    Nurse.findOne({
        _id: req.params.id
    }).exec(function (err, nurse) {
        if (err) return res.status(500).send(err);
        if (!nurse) return res.status(404).json({
            message: 'Nurse Not Found! '
        });

        res.status(200).json(nurse);
    });
};

exports.create = function (req, res) {
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        role: 'nurse'
    }
    User.create(newUser, function (err, user) {
        if (err) return res.status(500).send(err);

        req.body.userId = user._id;
        Nurse.create(req.body, function (err, nurse) {
            if (err) return res.status(500).send(err);

            res.status(201).send(nurse);
        });
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/nurses/234567890

    if (req.body._id) delete req.body._id;
    Nurse.findOne({
        _id: req.params.id
    }).exec(function (err, nurse) {
        if (err) return res.status(500).send(err);
        if (!nurse) return res.status(404).json({
            message: 'Nurse Not Found! '
        });

        let updated = _.merge(nurse, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Nurse Updated',
                nurse: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Nurse.findOne({
        _id: req.params.id
    }).exec(function (err, nurse) {
        if (err) return res.status(500).send(err);
        if (!nurse) return res.status(404).json({
            message: 'Nurse Not Found! '
        });

        User.findOneAndRemove({
            _id: nurse.userId
        }, function (err, userDeleted) {
            if (err) return res.status(500).send(err);

            nurse.remove(function (err) {
                if (err) return res.status(500).send(err);

                res.status(200).json({
                    massage: 'Job Deleted!'
                });
            });
        });
    });
}