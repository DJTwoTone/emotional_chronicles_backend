const express = require('express');
const User = require('../models/user');
const createToken = require('../helpers/authToken');
const ExpressError = require('../helpers/expressError')

const router = new express.Router();

router.post('/login', async function(req, res, next) {
    try {
        const username = req.body.username
        const check = await User.userCheck(username)
        
        if (!check) {
            throw new ExpressError(`It seems the username "${username}" does not exist`, 404)
        }
        
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.json({ token })
    } catch (err) {
        
        return next(err);
    }
})

module.exports = router;