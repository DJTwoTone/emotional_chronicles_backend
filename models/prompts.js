/**
 * This model is for writing prompts provided to the user.
 * It gets a certain number of prompts, adds them, checks if any have been flagged as inappropriate, changes the flag, or deletes a prompt.
 * In the future a function to editing the prompts could be included.
 * In addition, much of this functionality has not been implimented on the frontend, but could be easily.
 */


const db = require('../db');

class Prompts {

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

}

module.exports = Prompts;