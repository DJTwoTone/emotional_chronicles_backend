//add express custom errors

const express = require('express');

const Emotions = require('../models/emotions');


const router = express.Router();

//emotions routes

router.get('/', async function (req, res, next) {
    try {
        const num = req.query.num || 1;

        const emotions = await Emotions.getEmotions(num);
        
        return res.json({ emotions });
        
    } catch (e) {
        return next(e)
    }
})


module.exports = router;




