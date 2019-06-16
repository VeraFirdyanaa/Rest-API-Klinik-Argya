const _ = require('lodash');
const Q = require('q');
const Queue = require('./queue.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/queues?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    let query = {
        code: {
            $regex: req.query.code || '',
            $options: 'i'
        }
    };

    //proses async
    Q.all([
            Queue.count(query), //total data
            Queue.find(query).sort('timeCome').populate('patient').skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, queues) {
            res.status(200).json({
                total,
                queues
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Queue.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, queues) {
        if (err) return res.status(500).send(err);

        res.status(200).json(queues);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/queues/234567890
    Queue.findOne({
        _id: req.params.id
    }).populate('patient').exec(function (err, queue) {
        if (err) return res.status(500).send(err);
        if (!queue) return res.status(404).json({
            message: 'Queue Not Found! '
        });

        res.status(200).json(queue);
    });
};

exports.create = function (req, res) {
    // Lakukan pengecekan bahwa Patient yang sudah booking tidak bisa booking lagi.
    Queue.create(req.body, function (err, queue) {
        if (err) return res.status(500).send(err);

        res.status(201).send(queue);
    });
};

exports.checkIn = function (req, res) {
    if (!req.params.id) return res.status(400).json({
        message: "Params ID is Required!"
    });

    Queue.findOne({
        _id: req.params.id
    }).exec(function (err, queue) {
        if (err) return res.status(500).send(err);
        if (!queue) return res.status(404).json({
            message: 'Appointment not Found!'
        });

        queue.hasCome = true;
        queue.save(function (err) {
            if (err) return res.status(500).send(err);

            return res.status(200).json({
                message: 'Appointment was Saved & Patient has Come!'
            });
        });
    });
};

exports.update = function (req, res) {
    //http://localhost:5000/api/queues/234567890

    if (req.body._id) delete req.body._id;
    Queue.findOne({
        _id: req.params.id
    }).exec(function (err, queue) {
        if (err) return res.status(500).send(err);
        if (!queue) return res.status(404).json({
            message: 'Queue Not Found! '
        });

        let updated = _.merge(queue, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Queue Updated',
                queue: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Queue.findOne({
        _id: req.params.id
    }).exec(function (err, queue) {
        if (err) return res.status(500).send(err);
        if (!queue) return res.status(404).json({
            message: 'Queue Not Found! '
        });

        queue.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}