
const express = require('express');
const ExpressError = require('../helpers/expressError');
const Resources = require('../models/resources');
const { authUser, authAdmin } = require('../middleware/auth');

const router = express.Router();

//emotions routes

router.get('/emotions/:num?', async function (req, res, next) {
    try {
        const num = req.params.num || 20;

        const emotions = await Resources.getEmotions(num);

        return res.json({emotions});
        
    } catch (e) {
        return next(e)
    }
})

//prompts routes

router.get('/prompt', async function (req, res, next){
    try {
        
        const prompt = await Resources.getPrompt();

        return res.json({ prompt })

    } catch (e) {
        return next(e);
    }
})


router.get('/prompts/flagged', authAdmin, async function (req, res, next) {
    try {

        const prompts = await Resources.getFlaggedPrompts();

        return res.json({prompts})

    } catch (e) {
        return next(e);
    }
})

router.get('/prompts/:num?', async function (req, res, next) {
    try {
        
        const num = req.params.num || 10;

        const prompts = await Resources.getPrompts(num);

        return res.json({prompts})

    } catch (e) {
        return next(e);
    }
})


router.post('/prompts', authUser, async function (req, res, next) {
    try {
        const prompt = req.body.prompt;

        const flagged = req.body.is_admin ? false : true;

        const addedPrompt = await Resources.addPrompt(prompt, flagged);
        
        return res.json({addedPrompt})

    } catch (e) {
        return next(e);
    }
})

router.patch('/prompts/:id', authUser, async function (req, res, next) {
    try {

        const id = req.params.id;

        const changeFlagTo = req.body.is_admin ? true : false;

        const prompt = await Resources.changePromptFlag(id, changeFlagTo);

        return res.json({prompt})
        
    } catch (e) {
        return next(e);
    }
})

router.delete('/prompts/:id', authAdmin, async function (req, res, next) {
    try {

        const id = req.params.id;

        await Resources.deletePrompt(id)
        
        return res.json({ message: 'The prompt has been deleted' })
    } catch (e) {
        return next(e);
    }
})

//inspirations routes

router.get('/inspiration', async function (req, res, next){
    try {
        
        const inspiration = Resources.getInspiration();

        return res.json({ inspiration })

    } catch (e) {
        return next(e);
    }
})

router.get('/inspirations/flagged', async function(req, res, next) {
    try {

        const inspirations = Resources.getFlaggedInspirations();

        return res.json({ inspirations })
        
    } catch (e) {
        return next(e);
    }
})

router.get('/inspirations/:num?', async function (req, res, next) {
    try {
        
        const num = req.params.num || 10;

        const inspirations = Resources.getInspirations(num);

        return res.json({ inspirations })

    } catch (e) {
        return next(e);
    }
})


router.post('/inspirations', authUser, async function (req, res, next) {
    try {
        const inspiration = req.body.inspiration;

        const flagged = req.body.is_admin ? false : true;

        const addedInspiration = await Resources.addInspiration(inspiration, flagged);

        return res.json({ addedInspiration });

    } catch (e) {
        return next(e);
    }
})

router.patch('/inspirations/:id', authUser, async function (req, res, next) {
    try {
        
        const id = req.params.id;

        const changeFlagTo = req.body.is_admin ? true : false;

        const inspiration = Resources.changeInspirationFlag(id, changeFlagTo);

        return res.json({ inspiration });

    } catch (e) {
        return next(e);
    }
})

router.delete('/inspirations/:id', authAdmin, async function (req, res, next) {
    try {

        const id = req.params.id;

        await Resources.deleteInspiration(id);

        return res.json({ message: 'The inspiration has been deleted' })
        
    } catch (e) {
        return next(e);
    }
})

module.exports = router;




