const partialUpdateSQL = require('../../helpers/partialUpdate');

describe("partialUpdate()", () => {
    it('should generate a partial update query for just 1 field',
        function () {
            const update = partialUpdateSQL('test', {firstName: 'testy', lastName: 'McTestface', email: 'test@test.test'}, 'username', 'testuser')
            expect(update.query).toEqual("UPDATE test SET first_name=$1, last_name=$2, email=$3 WHERE username=$4 RETURNING *")
            expect(update.values).toEqual(['testy', 'McTestface', 'test@test.test', 'testuser'])
        }
    )
})