const _ = require('lodash');
const Q = require('q');
const MedicalRecord = require('./medicalRecord.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/medicalRecords?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        MedicalRecord.count(), //total data
        MedicalRecord.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, medicalRecords){
            res.status(200).json({ total , medicalRecords});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    MedicalRecord.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, medicalRecords){
        if(err)return res.status(500).send(err);

        res.status(200).json(medicalRecords);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/medicalRecords/234567890
    MedicalRecord.findOne({ _id: req.params.id }).exec(function(err, medicalRecord){
        if(err)return res.status(500).send(err);
        if(!medicalRecord)return res.status(404).json({ message:'MedicalRecord Not Found! '});

        res.status(200).json(medicalRecord);
    });
};

exports.create = function(req,res){
    MedicalRecord.create(req.body, function(err, medicalRecord){
        if(err)return res.status(500).send(err);

        res.status(201).send(medicalRecord);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/medicalRecords/234567890

     if(req.body._id) delete req.body._id;
     MedicalRecord.findOne({ _id: req.params.id }).exec(function(err, medicalRecord){
        if(err)return res.status(500).send(err);
        if(!medicalRecord)return res.status(404).json({ message:'MedicalRecord Not Found! '});

        let updated = _.merge(medicalRecord, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'MedicalRecord Updated', medicalRecord: updated });
        });
    });
}

exports.destroy = function(req, res){

    MedicalRecord.findOne({ _id: req.params.id }).exec(function(err, medicalRecord){
        if(err)return res.status(500).send(err);
        if(!medicalRecord)return res.status(404).json({ message:'MedicalRecord Not Found! '});

       medicalRecord.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}