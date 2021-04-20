const express = require('express');
const ExpressError = require('../helpers/expressError');
const Admin = require('../models/admin');
const { authAdmin } = require('../middleware/auth');
const { json } = require('express');

const router = express.Router();



router.get('/inspirations', authAdmin, async function(req, res, next) {
    try {

        const returnedFlagged = await Admin.getFlaggedInspiration();
        
        if (returnedFlagged.length) {
            return res.json({ message: "Please look at these submitted inspirations", flagged: returnedFlagged})

        } else {
            return res.json({ message: "No inspirations need approval" })
        }
    

    } catch (e) {
        return next(e);
    }
})


router.post('/inspirations', authAdmin, async function(req, res, next) {

    try {
        const inspiration = req.body.inspiration;

        await Admin.addInspiration(inspiration);

        return res.status(201).json({ message: "Inspiration added"})
    } catch (e) {
        return next(e)
    }

})

router.patch('/inspirations/:id', authAdmin, async function(req, res, next) {

    try {
        const id = req.params.id;

        await Admin.approveInspiration(id);

        return res.json({ message: "Inspiration approved."})
    } catch (e) {
        return next(e);
    }
})

router.delete('/inspirations/:id', authAdmin, async function(req, res, next) {

    try {

        const id = req.params.id;

        await Admin.delInspiration(id);

        return res.json({ message: "Inspiration rejected and deleted." })

    } catch (e) {

        return next(e);
    }
})

module.exports = router;