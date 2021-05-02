/**
 *  We have 5 endpoints here.
 * 1. Gets all flagged writing prompts.
 * 2. Gets a certain number of prompts, ones are flagged are not included.
 * 3. Adds a prompt. If it is added by a user, it is flagged for approval. If it is added by an admin, it is automatically approved
 * 4. Switches the flag on a prompt, this can be used by users to mark a prompt as inappropriate or by an admin to approve a prompt.
 * 5. Deletes a prompt.
 * In addition, much of this functionality has not been implimented on the frontend, but could be easily. 
 */


const express = require('express');
const jwt = require('jsonwebtoken');
// const ExpressError = require('../helpers/expressError');
const Prompts = require('../models/prompts');
const { authUser, authAdmin } = require('../middleware/auth');
const { SECRET_KEY } = require('../config');


const router = express.Router();


//prompts routes
router.get('/flagged', authAdmin, async function (req, res, next) {
    try {

        const prompts = await Prompts.getFlaggedPrompts();

        return res.json({ prompts })

    } catch (e) {
        return next(e);
    }
})

router.get('/', async function (req, res, next) {
    try {
        
        const num = req.query.num || 1;

        const prompts = await Prompts.getPrompts(num);

        return res.json({ prompts })

    } catch (e) {
        return next(e);
    }
})




router.post('/', authUser, async function (req, res, next) {
    try {
        const prompt = req.body.prompt;

        const token = req.body._token;

        const flagged = jwt.verify(token, SECRET_KEY).is_admin ? false : true;

        const addedPrompt = await Prompts.addPrompt(prompt, flagged);
        
        return res.json({ prompt: addedPrompt })

    } catch (e) {
        return next(e);
    }
})

router.patch('/:id', authUser, async function (req, res, next) {
    try {

        const id = req.params.id;

        const token = req.body._token;

        const changeFlagTo = jwt.verify(token, SECRET_KEY).is_admin ? false : true;;

        const prompt = await Prompts.changePromptFlag(id, changeFlagTo);

        return res.json({prompt})
        
    } catch (e) {
        return next(e);
    }
})

router.delete('/:id', authAdmin, async function (req, res, next) {
    try {

        const id = req.params.id;

        await Prompts.deletePrompt(id)
        
        return res.json({ message: 'The prompt has been deleted' })
    } catch (e) {
        return next(e);
    }
})


module.exports = router;




