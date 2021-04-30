/**
 * There should be defaults for all these variables.
 * They can be set in a .env file on development or via the command line on deployment
 */

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 3001;

const SSLSETTING = process.env.ssl || null;


let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "emo-chron-test";
} else {
    DB_URI = process.env.DATABASE_URL || "emo-chron"
}

module.exports = {
    SECRET_KEY,
    PORT,
    DB_URI,
    SSLSETTING
};