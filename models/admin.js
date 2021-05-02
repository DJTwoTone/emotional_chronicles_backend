/**
 * This admin model could be included in other models, I felt that keeping them here was more appropriate for their functionality as they are actions for only an admin.
 * They focus on inspirational quotes becuase the functionality for prompts has not been implimented, but prompts routes would be similar.
 * Here we can get flagged quotes, approve flagged quotes, delete quotes
 * 
 * Note - If the functionality for prompt were implimented, it may be appropriate to create a seperate model.
 */



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