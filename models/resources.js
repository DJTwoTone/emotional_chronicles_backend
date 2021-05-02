/**
 * This is unused. They have been implimnted elsewhere and may be deleted in the future.
 * 
 */

const db = require('../db');


class Resources {

    static async getEmotions(num) {
        const res = await db.query(
            `SELECT *
            FROM emotions_list
            ORDER BY RANDOM()
            LIMIT $1`, [num]
        );

        const emotions = res.rows.flat();
        return emotions;
    }

    static async getPrompt() {
        const res = await db.query(
            `SELECT *
            FROM prompts_list
            WHERE flagged = FALSE
            ORDER BY RANDOM()
            LIMIT 1`
        );

        
        const prompt = res.rows[0];
        return prompt;
    }

    static async getPrompts(num) {
        const res = await db.query(
            `SELECT *
            from prompts_list
            WHERE flagged = FALSE
            ORDER BY RANDOM()
            LIMIT $1`, [num]
        );

        const prompts = res.rows.flat();
        return prompts;
    }
    static async getFlaggedPrompts() {
        const res = await db.query(
            `SELECT *
            from prompts_list
            WHERE flagged = TRUE
            `
        );

        const prompts = res.rows.flat();
        return prompts;
    }

    static async addPrompt(prompt, flagged) {
        const res = await db.query(
            `INSERT into prompts_list (prompt, flagged)
            VALUES ($1, $2)
            RETURNING *`, [prompt, flagged]
        ); 

        return res.rows[0];
    }

    static async changePromptFlag(id, flagged) {
        const res = await db.query(
            `UPDATE prompts_list
            SET flagged = $1
            WHERE id = $2
            RETURNING *`, [flagged, id]
        );

        return res.rows[0];
    }

    static async deletePrompt(id) {
        const res = await db.query(
            `DELETE FROM prompts_list
            WHERE id = $1
            RETURNING prompt`, [id]
        )
    }

    static async getInspiration() {
        const res = await db.query(
            `SELECT *
            FROM inspirations
            WHERE flagged = FALSE
            ORDER BY RANDOM()
            LIMIT 1`
        );

        const inspiration = res.rows[0];
        return inspiration;
    }

    static async getInspirations(num) {
        const res = await db.query(
            `SELECT *
            FROM inspirations
            WHERE flagged = FALSE
            ORDER BY RANDOM()
            LIMIT $2`, [num]
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

module.exports = Resources;