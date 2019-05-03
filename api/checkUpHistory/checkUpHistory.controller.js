const _ = require('lodash');
const Q = require('q');
const CheckUpHistory = require('./checkUpHistory.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/checkUpHistorys?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        CheckUpHistory.count(), //total data
        CheckUpHistory.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, checkUpHistorys){
            res.status(200).json({ total , checkUpHistorys});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    CheckUpHistory.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, checkUpHistorys){
        if(err)return res.status(500).send(err);

        res.status(200).json(checkUpHistorys);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/checkUpHistorys/234567890
    CheckUpHistory.findOne({ _id: req.params.id }).exec(function(err, checkUpHistory){
        if(err)return res.status(500).send(err);
        if(!checkUpHistory)return res.status(404).json({ message:'CheckUpHistory Not Found! '});

        res.status(200).json(checkUpHistory);
    });
};

exports.create = function(req,res){
    CheckUpHistory.create(req.body, function(err, checkUpHistory){
        if(err)return res.status(500).send(err);

        res.status(201).send(checkUpHistory);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/checkUpHistorys/234567890

     if(req.body._id) delete req.body._id;
     CheckUpHistory.findOne({ _id: req.params.id }).exec(function(err, checkUpHistory){
        if(err)return res.status(500).send(err);
        if(!checkUpHistory)return res.status(404).json({ message:'CheckUpHistory Not Found! '});

        let updated = _.merge(checkUpHistory, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'CheckUpHistory Updated', checkUpHistory: updated });
        });
    });
}

exports.destroy = function(req, res){

    CheckUpHistory.findOne({ _id: req.params.id }).exec(function(err, checkUpHistory){
        if(err)return res.status(500).send(err);
        if(!checkUpHistory)return res.status(404).json({ message:'CheckUpHistory Not Found! '});

       checkUpHistory.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}