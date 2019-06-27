const _ = require('lodash');
const Q = require('q');
const Opname = require('./opname.model');
const Room = require('../room/room.model');

//membuat function
exports.index = function (req, res) {
    // http://localhost:5000/api/opnames?page=1&limit=10
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
        Opname.count(query), //total data
        Opname.find(query).sort('name').skip(skip).limit(limit) //jumlah data
    ])
        .spread(function (total, opnames) {
            res.status(200).json({
                total,
                opnames
            });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
};

// exports.search = function (req, res) {
//     //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
//     Opname.find({
//         : {
//             $regex: req.query.value,
//             $options: 'i'
//         }
//     }).exec(function (err, opnames) {
//         if (err) return res.status(500).send(err);

//         res.status(200).json(opnames);
//     });
// };

exports.show = function (req, res) {
    //http://localhost:5000/api/opnames/234567890
    Opname.findOne({
        _id: req.params.id
    }).exec(function (err, opname) {
        if (err) return res.status(500).send(err);
        if (!opname) return res.status(404).json({
            message: 'Opname Not Found! '
        });

        res.status(200).json(opname);
    });
};

exports.create = function (req, res) {
    Opname.create(req.body, function (err, opname) {
        if (err) return res.status(500).send(err);

        res.status(201).send(opname);
    });
}

exports.setOpname = function (req, res) {
    if (!req.params.id) return res.status(400).json({ message: "MedicalRecord ID Is Required!" });

    checkOpname(req.body.opname, function (err, opname) {
        if (err) return res.status(500).send(err);

        // Medicalrecord.update({ _id: req.params.id }, { $set: { opname: opname.opname._id } }).exec(function (err, result) {
        //     if (err) return res.status(500).send(err);
        return res.status(200).json(opname);
        // });
    });
};

function checkOpname(opnameObj, cb) {
    Opname.create(opnameObj, function (err, opname) {
        if (err) return cb(err);

        checkInRoom(opnameObj.room, opname._id, function (err, room, obj) {
            if (err) return cb(err);
            if (!err && !room && obj) {
                return cb(null, null, obj);
            }

            return cb(null, { opname: opname, room: room });
        });
    });
}

function checkInRoom(roomid, opnameId, cb) {
    Room.findOne({ _id: roomid }).exec(function (err, room) {
        if (err) return cb(err, null)
        if (!room) return cb(null, null, { message: "Room not Found!" });

        if (room.hospitalized.length >= room.roomCapacity) {
            return cb(null, null, { "message": "Room is Full" });
        }

        room.hospitalized.push(opnameId);
        room.markModified('hospitalized');
        room.save(function (err) {
            if (err) cb(err, null)

            return cb(null, room);
        });
    });
}

exports.update = function (req, res) {
    //http://localhost:5000/api/opnames/234567890

    if (req.body._id) delete req.body._id;
    Opname.findOne({
        _id: req.params.id
    }).exec(function (err, opname) {
        if (err) return res.status(500).send(err);
        if (!opname) return res.status(404).json({
            message: 'Opname Not Found! '
        });

        let updated = _.merge(opname, req.body);
        updated.save(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Opname Updated',
                opname: updated
            });
        });
    });
}

exports.destroy = function (req, res) {

    Opname.findOne({
        _id: req.params.id
    }).exec(function (err, opname) {
        if (err) return res.status(500).send(err);
        if (!opname) return res.status(404).json({
            message: 'Opname Not Found! '
        });

        opname.remove(function (err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                massage: 'Job Deleted!'
            });
        });
    });
}