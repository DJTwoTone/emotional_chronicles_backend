/**
 * This route only does one thing. It gets a list of emotions for the user to choose from.
 * 
 * In the future, including the same functionality as wiriting prompts and inspiration might be desireable, but at the moment, it is unneeded.
 */

const express = require('express');

const Emotions = require('../models/emotions');

const router = express.Router();



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




