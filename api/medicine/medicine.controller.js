const _ = require('lodash');
const Q = require('q');
const Medicine = require('./medicine.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/medicines?page=1&limit=10
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
            Medicine.count(query), //total data
            Medicine.find(query).sort('name').skip(skip).limit(limit) //jumlah data
        ])
        .spread(function (total, medicines) {
            res.status(200).json({
                total,
                medicines
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Medicine.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, medicines) {
        if (err) return res.status(500).send(err);

        res.status(200).json(medicines);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/medicines/234567890
    Medicine.findOne({
        _id: req.params.id
    }).exec(function (err, medicine) {
        if (err) return res.status(500).send(err);
        if (!medicine) return res.status(404).json({
            message: 'Medicine Not Found! '
        });

        res.status(200).json(medicine);
    });
};

exports.create = function (req, res) {
    Medicine.create(req.body, function (err, medicine) {
        if (err) return res.status(500).send(err);

        res.status(201).send(medicine);
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/medicines/234567890

    if (req.body._id) delete req.body._id;
    Medicine.findOne({
        _id: req.params.id
    }).exec(function (err, medicine) {
        if (err) return res.status(500).send(err);
        if (!medicine) return res.status(404).json({
            message: 'Medicine Not Found! '
        });

        let updated = _.merge(medicine, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Medicine Updated',
                medicine: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Medicine.findOne({
        _id: req.params.id
    }).exec(function (err, medicine) {
        if (err) return res.status(500).send(err);
        if (!medicine) return res.status(404).json({
            message: 'Medicine Not Found! '
        });

        medicine.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}