/**
 * You going to need a token.
 * This little function can be modified to create one for you
 */


const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');

function createToken(user) {
    let payload = {
        username: user.username,
        is_admin: user.is_admin
    };

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;