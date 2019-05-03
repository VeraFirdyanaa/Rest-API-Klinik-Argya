const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

const app = express();

mongoose.connect('mongodb://localhost/klinikArgya');
mongoose.connection.on('connected', function(){
    console.log('Database Connected');
});
mongoose.connection.on('error', function(err){
    console.log('Error to Connect Database', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
require('./routes')(app);

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))