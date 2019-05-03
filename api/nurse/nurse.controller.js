const _ = require('lodash');
const Q = require('q');
const Nurse = require('./nurse.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/nurses?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        Nurse.count(), //total data
        Nurse.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, nurses){
            res.status(200).json({ total , nurses});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Nurse.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, nurses){
        if(err)return res.status(500).send(err);

        res.status(200).json(nurses);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/nurses/234567890
    Nurse.findOne({ _id: req.params.id }).exec(function(err, nurse){
        if(err)return res.status(500).send(err);
        if(!nurse)return res.status(404).json({ message:'Nurse Not Found! '});

        res.status(200).json(nurse);
    });
};

exports.create = function(req,res){
    let newUser = {
        username: req.body.username,
        password: req.body.password,
        role: 'nurse'
    }
    User.create(newUser, function(err, user){
        if(err) return res.status(500).send(err);

        req.body.userId = user._id;
        Nurse.create(req.body, function(err, nurse){
            if(err)return res.status(500).send(err);
    
            res.status(201).send(nurse);
        });
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/nurses/234567890

     if(req.body._id) delete req.body._id;
     Nurse.findOne({ _id: req.params.id }).exec(function(err, nurse){
        if(err)return res.status(500).send(err);
        if(!nurse)return res.status(404).json({ message:'Nurse Not Found! '});

        let updated = _.merge(nurse, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'Nurse Updated', nurse: updated });
        });
    });
}

exports.destroy = function(req, res){

    Nurse.findOne({ _id: req.params.id }).exec(function(err, nurse){
        if(err)return res.status(500).send(err);
        if(!nurse)return res.status(404).json({ message:'Nurse Not Found! '});

       nurse.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}