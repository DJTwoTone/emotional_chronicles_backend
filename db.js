/**
 * This file connects the app to the database.
 * Don't forget to set the DGB_URI
 * The ssl setting is used in HEROKU for the free tier. It can be set here or it can be set on the command line with 'heroku config:set PGSSLMODE=no-verify'.
 */
const { Client } = require('pg');
const { DB_URI, SSLSETTING } = require('./config');

const db = new Client({
    connectionString: DB_URI,  
    ssl: SSLSETTING
});


db.connect();

module.exports = db;