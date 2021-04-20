// You need a database called emo-chron-test
// Seed it with the testing-data.psql file

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');
const User = require('../../models/user');

let testData = {}

beforeEach(async function() {
    try {
        const hashedPassword = await bcrypt.hash('password', 1);
        const testUser = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
            VALUES ('testuser', $1, 'testy', 'mctestface', 'test@test.test', false)
            RETURNING *`,
            [hashedPassword]
        )

        testData.user = testUser.rows[0];

        const userRes = await request(app)
        .post('/login')
        .send({
            username: 'testuser',
            password: 'password'
        });

        testData.user.token = userRes.body.token;

        const testAdmin = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
            VALUES ('testadmin', $1, 'testy', 'mctestface', 'test@test.test', true)
            RETURNING *`,
            [hashedPassword]
        )

        testData.admin = testAdmin.rows[0];

        
        const adminRes = await request(app)
        .post('/login')
        .send({
            username: 'testadmin',
            password: 'password'
        });

        testData.admin.token = adminRes.body.token;
        
    } catch (error) {
        console.error('Before Each',error);
    }
})

afterEach(async function() {
    try {
        await db.query('DELETE FROM users')
        testData = {}
    } catch (error) {
        console.error('After Each', error);
    }
})

afterAll(async function() {
    try {
        await db.end()
    } catch (error) {
        console.error('After All', error)
    }
})

describe('test GET routes for users', () => {
    
    test('gets a single user', async function() {
        
        const responce = await request(app)
        .get(`/users/${testData.user.username}`)
        .send({_token: testData.user.token})
        .set({ Authorization: `Bearer ${testData.user.token}` });

        expect(responce.body.user).toHaveProperty('username');
        expect(responce.body.user).not.toHaveProperty('password');
        expect(responce.body.user.username).toBe('testuser')
    })

    test('gets a single admin', async function() {
        
        const responce = await request(app)
        .get(`/users/${testData.admin.username}`)
        .send({_token: testData.admin.token})
        .set({ Authorization: `Bearer ${testData.admin.token}` });

        expect(responce.body.user).toHaveProperty('username');
        expect(responce.body.user).not.toHaveProperty('password');
        expect(responce.body.user.username).toBe('testadmin')
        expect(responce.body.user.is_admin).toBe(true)

    })

    test('404 error if cannot find user', async function() {
        
        const responce = await request(app)
        .get(`/users/notauser`)
        .send({_token: testData.admin.token})
        .set({ Authorization: `Bearer ${testData.admin.token}` });

        expect(responce.statusCode).toBe(404)
    })

    // test('reject get request with a wrong token', async function() {
    //     const responce = await request(app)
    //     .get(`/users/${testData.user.username}`)
    //     .send({_token: 'xxx'})
    //     .set({ Authorization: `Bearer XXXXXXX` })
    //     expect(responce.statusCode).toBe(401)
    //     expect(responce.body.message).toBe("It appears you shouldn't be here. Couldn't be authenticated")
    // })
})

describe('test POST routes from users', () => {

    test('creates a new user', async function() {
        const newUser = {
            username: 'newtestuser',
            firstName: 'Bob',
            lastName: 'Testface',
            password: 'password',
            email: 'newtester@test.test'
        }

        const responce = await request(app)
        .post('/users')
        .send(newUser);

        expect(responce.statusCode).toBe(201)
        expect(responce.body).toHaveProperty('token');

        const bob = await User.getUser('newtestuser');
        
        expect(newUser['firstName']).toEqual(bob['first_name']);
        expect(newUser['lastName']).toEqual(bob['last_name']);
        expect(newUser['email']).toEqual(bob['email']);
        
        
    })

    test('cannot create a user with a used user name', async function() {
        const response = await request(app)
        .post('/users')
        .send({
            username: 'testuser',
            firstName: 'Tim',
            lastName: 'Testface',
            password: 'password',
            email: 'cannotbetester@test.test'
        })

        expect(response.statusCode).toBe(400)
    })

    test('must have a password to create a user', async function() {
        const responce = await request(app)
        .post('/users')
        .send({
            username: 'theblackknight',
            firstName: 'Monty',
            lastName: 'Testface',
            email: 'justascratch@test.test'
        })
    })
  
})


    // The following routes have not been fully implimented, but may be in the future
    // They are tested here to speed that implimentation when needed

describe("test PATCH routes for users", () => {

    test("update a user's first name", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            firstName: 'Testier',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.body.user).toHaveProperty('username');
        expect(responce.body.user).not.toHaveProperty('password');
        expect(responce.body.user.first_name).toBe('Testier');
        expect(responce.body.user.first_name).not.toBe('testy');
        expect(responce.body.user.first_name).not.toBe(null);

    })

    test("update a user's password", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            password: 'qwerty',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.body.user).toHaveProperty('username')
        expect(responce.body.user.username).toBe(testData.user.username)
        expect(responce.body.user).not.toHaveProperty('password')

        const loginRes = await request(app)
        .post('/login')
        .send({
            username: 'testuser',
            password: 'qwerty'
        });

        expect(loginRes.body).toHaveProperty('token');
    })

    test("not allowed to edit username", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            username: 'realuser',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(400);
    })

    test("not allowed to edit admin priveledges", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            is_admin: true,
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(400)
    })

    test("return error for incorrect data", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            coolness: 3.14,
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(400);
    })

    test("prevents editing other users data", async function() {
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            password: 'qwerty',
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.statusCode).toBe(401);
        expect(responce.body.message).toBe("It appears you shouldn't be here. You shouldn't play in other people's accounts");
    })

    test("404 error if cannot find user", async function() {
        await request(app)
        .delete(`/users/${testData.user.username}`)
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })
        
        
        const responce = await request(app)
        .patch(`/users/${testData.user.username}`)
        .send({
            password: 'qwerty',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(404);
    })

})

describe("test PATCH routes for users", () => {

    test('delete a user', async function() {
        const responce = await request(app)
        .delete(`/users/${testData.user.username}`)
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.body.message).toBe(`You have successfully deleted your account for "${testData.user.username}"`)
    })

    test('prevents users from deleting other users', async function() {
        const responce = await request(app)
        .delete(`/users/${testData.user.username}`)
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.statusCode).toBe(401);
        expect(responce.body.message).toBe("It appears you shouldn't be here. You shouldn't play in other people's accounts");
    })

        test("404 error if cannot find user", async function() {
        await request(app)
        .delete(`/users/${testData.user.username}`)
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })
        
        const responce = await request(app)
        .delete(`/users/${testData.user.username}`)
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(404);
    })



})