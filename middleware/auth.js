const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require('../helpers/expressError');

function authUser(req, res, next) {
    try {
        
        const token = req.headers.authorization.split(' ')[1] || req.body._token;

        jwt.verify(token, SECRET_KEY);
        return next();
    } catch (e) {
        return next(new ExpressError("It appears you shouldn't be here. Couldn't be authenticated", 401));
    };
};


function authAdmin(req, res, next) {
    try {
        const submittedToken = req.headers.authorization.split(' ')[1] || req.body._token;

        const token = jwt.verify(submittedToken, SECRET_KEY);

        if(token.is_admin) {
            return next();
        };

        throw new Error();
    } catch (e) {
        return next(new ExpressError("Sorry. You are not an administrator", 401));
    }
}

function checkCorrectUser(req, res, next) {
    try {

        const submittedToken = req.headers.authorization.split(' ')[1] || req.body._token;

        let token = jwt.verify(submittedToken, SECRET_KEY);

        if (token.username === req.params.username || token.username === req.body.username) {
            return next();
        };

        throw new Error();
        
    } catch (e) {
        return next(new ExpressError("It appears you shouldn't be here. You shouldn't play in other people's accounts", 401));
    }
}

module.exports = { authUser, authAdmin, checkCorrectUser }