/**
 *  We have 5 endpoints here.
 * 1. Gets all flagged inspirational quotes.
 * 2. Gets a certain number of quotes, ones are flagged are not included.
 * 3. Adds ispirational quotes. If it is added by a user, it is flagged for approval. If it is added by an admin, it is automatically approved
 * 4. Switches the flag on a quote, this can be used by users to mark a quote as suspect or by an admin to approve a quote.
 * 5. Deletes a quote. 
 */


const express = require('express');
const jwt = require('jsonwebtoken');
// const ExpressError = require('../helpers/expressError');
const Inspirations = require('../models/inspirations');
const { authUser, authAdmin } = require('../middleware/auth');
const { SECRET_KEY } = require('../config');

const router = express.Router();


//inspirations routes
router.get('/flagged', authAdmin, async function(req, res, next) {
    try {

        const inspirations = await Inspirations.getFlaggedInspirations();

        return res.json({ inspirations })
        
    } catch (e) {
        return next(e);
    }
})



router.get('/', async function (req, res, next) {
    try {
        
        const num = req.query.num || 1;

        const inspirations = await Inspirations.getInspirations(num);

        return res.json({ inspirations })

    } catch (e) {
        return next(e);
    }
})




router.post('/', authUser, async function (req, res, next) {
    
    try {
        const inspiration = req.body.inspiration;

        const token = req.headers.authorization.split(' ')[1] || req.body._token;

        const flagged = jwt.verify(token, SECRET_KEY).is_admin ? false : true;

        const addedInspiration = await Inspirations.addInspiration(inspiration, flagged);

        return res.json({ ...addedInspiration });

    } catch (e) {
        return next(e);
    }
})

router.patch('/:id', authUser, async function (req, res, next) {
    try {
        
        const id = req.params.id;

        const token = req.body._token;

        const changeFlagTo = jwt.verify(token, SECRET_KEY).is_admin ? false : true;;


        const inspiration = await Inspirations.changeInspirationFlag(id, changeFlagTo);

        return res.json({ inspiration });

    } catch (e) {
        return next(e);
    }
})

router.delete('/:id', authAdmin, async function (req, res, next) {
    try {

        const id = req.params.id;

        await Inspirations.deleteInspiration(id);

        return res.json({ message: 'The inspiration has been deleted' })
        
    } catch (e) {
        return next(e);
    }
})

module.exports = router;




