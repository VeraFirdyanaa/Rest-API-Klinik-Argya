const _ = require('lodash');
const Q = require('q');
const User = require('./user.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/users?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        User.count(), //total data
        User.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, users){
            res.status(200).json({ total , users});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    User.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, users){
        if(err)return res.status(500).send(err);

        res.status(200).json(users);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/users/234567890
    User.findOne({ _id: req.params.id }).exec(function(err, user){
        if(err)return res.status(500).send(err);
        if(!user)return res.status(404).json({ message:'User Not Found! '});

        res.status(200).json(user);
    });
};

exports.create = function(req,res){
    User.create(req.body, function(err, user){
        if(err)return res.status(500).send(err);

        res.status(201).send(user);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/users/234567890

     if(req.body._id) delete req.body._id;
     User.findOne({ _id: req.params.id }).exec(function(err, user){
        if(err)return res.status(500).send(err);
        if(!user)return res.status(404).json({ message:'User Not Found! '});

        let updated = _.merge(user, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'User Updated', user: updated });
        });
    });
}

exports.destroy = function(req, res){

    User.findOne({ _id: req.params.id }).exec(function(err, user){
        if(err)return res.status(500).send(err);
        if(!user)return res.status(404).json({ message:'User Not Found! '});

       user.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}