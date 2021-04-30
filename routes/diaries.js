const express = require('express');
const ExpressError = require('../helpers/expressError');
const { DateTime } = require("luxon")
const symantoCall = require('../helpers/symantoCall');
const Diaries = require('../models/diaries');
const { authUser, checkCorrectUser } = require('../middleware/auth');

const router = express.Router();

router.get('/:username/:date/check', checkCorrectUser, async function(req, res, next) {
    const { username, date } = req.params;

    try {

        let check = await Diaries.checkToday(username, date)
        
        return res.json({date, "entered": check})
        
    } catch (e) {
        return next(e)
    }
})


//get single entry by id
router.get('/:username/:date', checkCorrectUser, async function(req, res, next) {
    try {
        const entryDate = req.params.date;
        const username = req.params.username;
        const entry = await Diaries.getEntry(username, entryDate);


        return  res.json({ entry })
        
    } catch (e) {
        return next(e)
    }
})



//need to get a month of entries

router.get('/:username/month/:date', checkCorrectUser, async function(req, res, next) {
    try {
        const dateInMonth = req.params.date;
        const username = req.params.username;
        const month = await Diaries.getMonth(username, dateInMonth)
        return res.json({ month })
        
    } catch (e) {
        return next(e);
    }
})

//get all entries by user

router.get('/:username', checkCorrectUser, async function (req, res, next) {
    try {
        const username = req.params.username;

        const entries = await Diaries.getEntries(username);
        
        return res.json({ entries });

    } catch (e) {
        return next(e);
    }
})

//post entry 

router.post('/:username', authUser, async function (req, res, next) {
    
    try {
        const { diaryentry, emotions, prompt_id, inspiration_id } = req.body;
        const username = req.params.username;

     
        const today = DateTime.now().toISODate();

        const check = await Diaries.checkToday(username, today);

        if (check) {
            throw new ExpressError("You've already made an entry for today.")
        }

        

        const calldata = await symantoCall(diaryentry);

        if (!calldata[0].predictions) {
          
            let emopredictions = {"fear":0,"anger":0,"sadness":0,"surprise":0,"disgust":0,"joy":0,"no-emotion":0};

            throw new ExpressError("The emotional analysis service is currently down.")
        }

        let emopredictions = calldata[0].predictions.reduce((acc, emo) => {
            let { prediction, probability } = emo;
            return {...acc, [prediction]: probability}
        }, {});

        
        const data = {username, diaryentry, ...emopredictions, emotions, prompt_id, inspiration_id, today}

        const entry = await Diaries.addEntry(data)

        return res.json({ entry })

        
    } catch (e) {
        return next(e)
    }
})

//edit entry - I don't want this

//delete entry - need to delete all for a user including the link table


module.exports = router;