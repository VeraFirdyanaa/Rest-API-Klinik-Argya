function isAuthenticated(req, res, next) {
    var authKey = req.get('Authorization');
    if (!authKey) return res.send(401, {
        status: '0',
        error_code: 401,
        error_message: 'Unauthorized!'
    });


}

exports.isAuthenticated = isAuthenticated;