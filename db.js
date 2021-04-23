
const { Client } = require('pg');
const { DB_URI, sslValue } = require('./config');

const db = new Client({
    connectionString: DB_URI,  
    ssl: sslValue
});


db.connect();

module.exports = db;