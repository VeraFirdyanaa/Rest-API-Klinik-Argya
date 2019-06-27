module.exports = function (app) {
    app.use('/api/doctors', require('./api/doctor'));
    app.use('/api/nurses', require('./api/nurse'));
    app.use('/api/checkuphistorys', require('./api/checkuphistory'));
    app.use('/api/inpatients', require('./api/inpatient'));
    app.use('/api/medicalrecords', require('./api/medicalrecord'));
    app.use('/api/medicines', require('./api/medicine'));
    app.use('/api/patients', require('./api/patient'));
    app.use('/api/payments', require('./api/payment'));
    app.use('/api/queues', require('./api/queue'));
    app.use('/api/recipes', require('./api/recipe'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/rooms', require('./api/room'));
    app.use('/api/opnames', require('./api/opname'));
}