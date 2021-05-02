/**
 * These admin endpoints could be included in other routes, I felt that keeping them here was more appropriate for their functionality as they are actions for only an admin.
 * They focus on inspirational quotes becuase the functionality for prompts has not been implimented, but prompts routes would be similar.
 * The 4 routes allow Admins to:
 * 1. Get a list of the inspirational quotes that need approval
 * 2. Add inspirational quotes
 * 3. Approve inspirational quotes
 * 4. Delete inspirational quotes
 */


const express = require('express');
// const ExpressError = require('../helpers/expressError');
const Admin = require('../models/admin');
const { authAdmin } = require('../middleware/auth');
// const { json } = require('express');

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