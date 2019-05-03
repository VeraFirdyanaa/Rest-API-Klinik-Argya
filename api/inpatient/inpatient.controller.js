const _ = require('lodash');
const Q = require('q');
const Inpatient = require('./inpatient.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/inpatients?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        Inpatient.count(), //total data
        Inpatient.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, inpatients){
            res.status(200).json({ total , inpatients});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Inpatient.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, inpatients){
        if(err)return res.status(500).send(err);

        res.status(200).json(inpatients);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/inpatients/234567890
    Inpatient.findOne({ _id: req.params.id }).exec(function(err, inpatient){
        if(err)return res.status(500).send(err);
        if(!inpatient)return res.status(404).json({ message:'Inpatient Not Found! '});

        res.status(200).json(inpatient);
    });
};

exports.create = function(req,res){
    Inpatient.create(req.body, function(err, inpatient){
        if(err)return res.status(500).send(err);

        res.status(201).send(inpatient);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/inpatients/234567890

     if(req.body._id) delete req.body._id;
     Inpatient.findOne({ _id: req.params.id }).exec(function(err, inpatient){
        if(err)return res.status(500).send(err);
        if(!inpatient)return res.status(404).json({ message:'Inpatient Not Found! '});

        let updated = _.merge(inpatient, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'Inpatient Updated', inpatient: updated });
        });
    });
}

exports.destroy = function(req, res){

    Inpatient.findOne({ _id: req.params.id }).exec(function(err, inpatient){
        if(err)return res.status(500).send(err);
        if(!inpatient)return res.status(404).json({ message:'Inpatient Not Found! '});

       inpatient.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}