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