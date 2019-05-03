const _ = require('lodash');
const Q = require('q');
const Recipe = require('./recipe.model');

//membuat function
exports.index = function(req, res){
    // http://localhost:5000/api/recipes?page=1&limit=10
    let page = Number(req.query.page) || 1,
        limit = Number(req.query.limit) || 10,
        skip = (page -1) * limit;

    //proses async
    Q.all([
        Recipe.count(), //total data
        Recipe.find().skip(skip).limit(limit) //jumlah data
    ])
        .spread(function(total, recipes){
            res.status(200).json({ total , recipes});
        })
        .catch(function(err){
            res.status(500).send(err);
        });
};

exports.search = function(req,res){
    //http://localhost:5000/api/jobs/search?value=xdfgchgvjh
    Recipe.find({ name: { $regex: req.query.value, $options: 'i' } }).exec(function(err, recipes){
        if(err)return res.status(500).send(err);

        res.status(200).json(recipes);
    });
};

exports.show = function(req, res){
    //http://localhost:5000/api/recipes/234567890
    Recipe.findOne({ _id: req.params.id }).exec(function(err, recipe){
        if(err)return res.status(500).send(err);
        if(!recipe)return res.status(404).json({ message:'Recipe Not Found! '});

        res.status(200).json(recipe);
    });
};

exports.create = function(req,res){
    Recipe.create(req.body, function(err, recipe){
        if(err)return res.status(500).send(err);

        res.status(201).send(recipe);
    });
}

exports.update = function(req, res){
     //http://localhost:5000/api/recipes/234567890

     if(req.body._id) delete req.body._id;
     Recipe.findOne({ _id: req.params.id }).exec(function(err, recipe){
        if(err)return res.status(500).send(err);
        if(!recipe)return res.status(404).json({ message:'Recipe Not Found! '});

        let updated = _.merge(recipe, req.body);
        updated.save(function(err){
            if(err)return res.status(500).send(err);

            res.status(200).json({ massage: 'Recipe Updated', recipe: updated });
        });
    });
}

exports.destroy = function(req, res){

    Recipe.findOne({ _id: req.params.id }).exec(function(err, recipe){
        if(err)return res.status(500).send(err);
        if(!recipe)return res.status(404).json({ message:'Recipe Not Found! '});

       recipe.remove(function(err){
           if(err) return res.status(500).send(err);

           res.status(200).json({ massage: 'Job Deleted!' });
       });
    });
}