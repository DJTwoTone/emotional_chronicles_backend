
const db = require('../db');

class Admin {


    static async getFlaggedInspiration() {
        const res = await db.query(
            `SELECT id, inspiration, flagged
            FROM inspirations
            WHERE flagged = TRUE`
        );

        return res.rows;
    }

    static async approveInspiration(id) {
        const res = await db.query(
            `UPDATE inspirations
            SET flagged = FALSE
            WHERE id = $1
            RETURNING inspiration`, [id]
        );

        return res.rows[0]
    }

    static async delInspiration(id) {
        const res = await db.query(
            `DELETE from inspirations
            WHERE id = $1
            RETURNING inspiration`, [id]
        );

        return res.rows[0]
    }
}

module.exports = Admin;