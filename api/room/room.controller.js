const _ = require('lodash');
const Q = require('q');
const Room = require('./room.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/rooms?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page - 1) * limit;

    let query = {
        roomType: {
            $regex: req.query.name || '',
            $options: 'i'
        }
    };

    //proses async
    Q.all([
        Room.count(query), //total data
        Room.find(query).sort('name').skip(skip).limit(limit) //jumlah data
    ])
        .spread(function (total, rooms) {
            res.status(200).json({
                total,
                rooms
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

exports.availableRoom = function (req, res) {
    Room.find({ roomStatus: 'available' }).exec(function (err, rooms) {
        if (err) return res.status(200).json({ message: "Error to get Available Room", err: err });

        return res.status(200).json(rooms)
    });
}

exports.search = function (req, res) {
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Room.find({
        name: {
            $regex: req.query.value,
            $options: 'i'
        }
    }).exec(function (err, rooms) {
        if (err) return res.status(500).send(err);

        res.status(200).json(rooms);
    });
};

exports.show = function (req, res) {
    //http://localhost:5000/api/rooms/234567890
    Room.findOne({
        _id: req.params.id
    }).exec(function (err, room) {
        if (err) return res.status(500).send(err);
        if (!room) return res.status(404).json({
            message: 'Room Not Found! '
        });

        res.status(200).json(room);
    });
};

exports.create = function (req, res) {
    Room.create(req.body, function (err, room) {
        if (err) return res.status(500).send(err);

        res.status(201).send(room);
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/rooms/234567890

    if (req.body._id) delete req.body._id;
    Room.findOne({
        _id: req.params.id
    }).exec(function (err, room) {
        if (err) return res.status(500).send(err);
        if (!room) return res.status(404).json({
            message: 'Room Not Found! '
        });

        let updated = _.merge(room, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Room Updated',
                room: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Room.findOne({
        _id: req.params.id
    }).exec(function (err, room) {
        if (err) return res.status(500).send(err);
        if (!room) return res.status(404).json({
            message: 'Room Not Found! '
        });

        room.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}