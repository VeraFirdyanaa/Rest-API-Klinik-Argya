const _ = require('lodash');
const Q = require('q');
const Payment = require('./payment.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/payments?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        Payment.count(), //total data
        Payment.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, payments){
            res.status(200).json({ total , payments});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Payment.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, payments){
        if(err)return res.status(500).send(err);

        res.status(200).json(payments);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/payments/234567890
    Payment.findOne({ _id: req.params.id }).exec(function(err, payment){
        if(err)return res.status(500).send(err);
        if(!payment)return res.status(404).json({ message:'Payment Not Found! '});

        res.status(200).json(payment);
    });
};

exports.create = function(req,res){
    Payment.create(req.body, function(err, payment){
        if(err)return res.status(500).send(err);

        res.status(201).send(payment);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/payments/234567890

     if(req.body._id) delete req.body._id;
     Payment.findOne({ _id: req.params.id }).exec(function(err, payment){
        if(err)return res.status(500).send(err);
        if(!payment)return res.status(404).json({ message:'Payment Not Found! '});

        let updated = _.merge(payment, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'Payment Updated', payment: updated });
        });
    });
}

exports.destroy = function(req, res){

    Payment.findOne({ _id: req.params.id }).exec(function(err, payment){
        if(err)return res.status(500).send(err);
        if(!payment)return res.status(404).json({ message:'Payment Not Found! '});

       payment.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}