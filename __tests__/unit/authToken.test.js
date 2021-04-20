const createToken = require('../../helpers/authToken');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');


describe('authToken()', () => {
    it('should generate a token for authorization',
        function () {
            const token = createToken({username: 'testuser', is_admin: true});
            expect(jwt.verify(token, SECRET_KEY)).toBeTruthy();
            expect(jwt.verify(token, SECRET_KEY)).toHaveProperty('username');
            expect(jwt.verify(token, SECRET_KEY)).toHaveProperty('is_admin');
            expect(jwt.verify(token, SECRET_KEY)).toMatchObject({"is_admin": true, "username": "testuser"});
        }

    )
})