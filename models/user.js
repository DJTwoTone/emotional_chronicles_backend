const db = require('../db');
const bcrypt = require('bcrypt');
const ExpressError = require('../helpers/expressError');
const  partialUpdateSQL  = require('../helpers/partialUpdate');

const BCRYPT_WORK_FACTOR = 12;

class User {

    static async userCheck(username) {
        const res = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`, [username]
        )

        if (res.rows[0]) {
            return true;
        };

        return false;
    }

    static async register(data) {
        const { username, password, email } = data;
        const first_name = data.firstName;
        const last_name = data.lastName;
        const is_admin = data.isAdmin == true ? true : false

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const res = await db.query(
            `INSERT into users (username, password, first_name, last_name, email, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, password, first_name, last_name, email, is_admin`,
            [username, hashedPassword, first_name, last_name, email, is_admin]
        );

        return res.rows[0];
    }

    static async getUser(username) {
        const res = await db.query(
            `SELECT username, first_name, last_name, email, is_admin
            FROM users
            WHERE username = $1`, [username]
        );

        const user = res.rows[0];

        return user;
    }

    static async updateUser(username, data) {

        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        let { query, values } = partialUpdateSQL("users", data, "username", username);

        const res = await db.query(query, values);
        
        const user = res.rows[0];

        delete user.password;
        delete user.isAdmin;

        return user;
    }

    static async delete(username) {
        const res = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`, [username]
        );
    }

    static async authenticate(data) {
        const res = await db.query(
            `SELECT username, password, first_name, last_name, email, is_admin
            FROM users
            WHERE username = $1`, [data.username]
        );

        const user = res.rows[0];

        if(user) {
            const isValid = await bcrypt.compare(data.password, user.password);
            if (isValid) {
                return user;
            }
        }

        throw new ExpressError("Sorry. That password doesn't work", 401)
    }


}

module.exports = User;