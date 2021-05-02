/**
 * WELCOME TO THE MAIN APP SET UP OF EMOTIONAL CHRONICLES
 * 
 * Here you can see where and how all our endpoints are implimented.
 * 
 * As well as a little bit of error handling.
 */

const express = require('express');
const ExpressError = require('./helpers/expressError');

const cors = require('cors');
const app = express();

const userRoutes = require('./routes/users');
const diariesRoutes = require('./routes/diaries');
const emotionsRoutes = require('./routes/emotions')
const adminRoutes = require('./routes/admin')
const promptsRoutes = require('./routes/prompts')
const inspirationsRoutes = require('./routes/inspirations')
const loginRoute = require('./routes/login');

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/diaries", diariesRoutes);
app.use("/emotions", emotionsRoutes);
app.use("/admin", adminRoutes);
app.use("/prompts", promptsRoutes);
app.use("/inspirations", inspirationsRoutes)
app.use("/", loginRoute);

app.use(function(req, res, next) {
    const err = new ExpressError("Not found", 404);

    return next(err);
})

app.use(function(err, req, res, next) {
    
    const status = err.status || 500;
    if (process.env.NODE_ENV !== "test") {
        console.error(err.stack);
    }
    const message = res.message;

    return res.status(status).json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;