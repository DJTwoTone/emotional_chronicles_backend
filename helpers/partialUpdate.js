/**
 * this helper function is user to make parital updates the a SQL databse
 * if you give it the table you want, the columns you need as items, the key you are looking for as well as the id, it should give you a nice sql query
 */

function partialUpdateSQL(table, items, key, id) {

    let idx = 1;
    let columns = [];

    for (let key in items) {
        if (key.startsWith("_")) {
            delete items[key];
        }
    }

    for (let column in items) {
        let c = '';
        if (column === 'firstName') {
            c = 'first_name';
        } else if (column === 'lastName') {
            c = 'last_name';
        } else {
            c = column;
        }
        columns.push(`${c}=$${idx}`);
        ++idx;
    }

    let cols = columns.join(", ");
    let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`

    let values = Object.values(items);
    values.push(id);

    return { query, values }
}

module.exports = partialUpdateSQL;