/**
 * This model only does one thing. It gets a list of emotions for the user to choose from.
 * 
 * In the future, including the same functionality as wiriting prompts and inspiration might be desireable, but at the moment, it is unneeded.
 */


const db = require('../db');


class Emotions {

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

}

module.exports = Emotions;