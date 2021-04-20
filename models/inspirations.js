const db = require('../db');


class Inspirations {


    static async getInspirations(num) {
        const res = await db.query(
            `SELECT *
            FROM inspirations
            WHERE flagged = FALSE
            ORDER BY RANDOM()
            LIMIT $1`, [num]
        );

        const inspirations = res.rows.flat()
        return inspirations;
    }

    static async getFlaggedInspirations() {
        const res = await db.query(
            `SELECT *
            FROM inspirations
            WHERE flagged = TRUE
            `
        );

        const inspirations = res.rows.flat()
        return inspirations;
    }

    static async addInspiration(inspiration, flagged) {
        
        const res = await db.query(
            `INSERT into inspirations (inspiration, flagged)
            VALUES ($1, $2)
            RETURNING inspiration`, [inspiration, flagged]
        );

        return res.rows[0];
    }

    static async changeInspirationFlag(id, flagged) {
        const res = await db.query(
            `UPDATE inspirations
            SET flagged = $1
            WHERE id = $2
            RETURNING *`, [flagged, id]
        )

        return res.rows[0]
    }

    static async deleteInspiration(id) {
        const res = await db.query(
            `DELETE FROM inspirations
            WHERE id = $1
            RETURNING inspiration`, [id]
        )
    }

}

module.exports = Inspirations;