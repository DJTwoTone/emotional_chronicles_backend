// You need a database called emo-chron-test
// Seed it with the testing-data.psql file

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');
const Inspirations = require('../../models/inspirations');


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

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('All our dreams can come true, if we have the courage to pursue them.” – Walt Disney', true)`
        )

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('The secret of getting ahead is getting started.” – Mark Twain', true)`
        )

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('I’ve missed more than 9,000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life and that is why I succeed.” – Michael Jordan', true)`
        )

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('“Don’t limit yourself. Many people limit themselves to what they think they can do. You can go as far as your mind lets you. What you believe, remember, you can achieve.” – Mary Kay Ash', false)`
        )

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('“The best time to plant a tree was 20 years ago. The second best time is now.” – Chinese Proverb', false)`
        )

        await db.query(
            `INSERT INTO inspirations (inspiration, flagged)
            VALUES ('“Only the paranoid survive.” – Andy Grove', false)`
        )


    } catch (error) {
        console.error('Before Each',error);
    }
})

afterEach(async function() {
    try {
        await db.query('DELETE FROM users')
        await db.query('DELETE FROM inspirations')
        await db.query('ALTER SEQUENCE inspirations_id_seq RESTART WITH 1')

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


describe('test GET routes for inspirations', () => {

    test('gets a single inspiration', async function() {

        const responce = await request(app)
        .get('/inspirations')

        expect(responce.body).toHaveProperty('inspirations');
        expect(responce.body.inspirations).toHaveLength(1)

    })

    test('gets multiple inspirations', async function() {

        const responce = await request(app)
        .get('/inspirations?num=3')

        expect(responce.body).toHaveProperty('inspirations');
        expect(responce.body.inspirations).toHaveLength(3)

    })

    test('gets flagged inspirations', async function() {

        const responce = await request(app)
        .get('/inspirations/flagged')
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body).toHaveProperty('inspirations');
        expect(responce.body.inspirations).toHaveLength(3)

    })
})


//There are currently 6 inspirations; 3 flagged and 3 approved
describe('test POST route for inspirations', () => {

    test('adds a inspiration from a user', async function() {
        //the added inspiration should be flagged
        
        const responce = await request(app)
        .post('/inspirations')
        .send({
            inspiration: 'What are you grateful for?',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })
        
        expect(responce.body).toHaveProperty('inspiration')
        
        const flagged = await request(app)
        .get('/inspirations/flagged')
        .set({ Authorization: `Bearer ${testData.admin.token}` })
        
        expect(flagged.body.inspirations).toHaveLength(4)
        
        
    })
    
    test('adds a inspiration from a admin', async function() {
        //the added inspiration should not be flagged
        
        const responce = await request(app)
        .post('/inspirations')
        .send({
            inspiration: 'What are you grateful for?',
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body).toHaveProperty('inspiration')

        const flagged = await request(app)
        .get('/inspirations/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.inspirations).toHaveLength(3)


    })
})

//There are currently 6 inspirations; 3 flagged and 3 approved
describe('test PATCH route for inspirations', () => {

    //the flagged length should be 2
    test('flip a flagged inspiration to approved', async function() {

        await request(app)
        .patch('/inspirations/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        const flagged = await request(app)
        .get('/inspirations/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.inspirations).toHaveLength(2)
    })

    //the flagged length should be 4
    test('flip an approved inspiration to flagged', async function() {

        await request(app)
        .patch('/inspirations/4')
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        const flagged = await request(app)
        .get('/inspirations/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.inspirations).toHaveLength(4)
    })
})

describe('test PATCH route for inspirations', () => {

    //the flagged length should be 2 after deleting #1
    test('delete a single inspiration', async function() {

        const responce = await request(app)
        .delete('/inspirations/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body.message).toBe('The inspiration has been deleted')
        expect(responce.statusCode).toBe(200)

        const flagged = await request(app)
        .get('/inspirations/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.inspirations).toHaveLength(2)
    })

    //the flagged length should be 0 after deleting all flagged
    test('delete multiple inspirations', async function() {

        await request(app)
        .delete('/inspirations/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })
        
        await request(app)
        .delete('/inspirations/2')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })
        
        await request(app)
        .delete('/inspirations/3')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        const flagged = await request(app)
        .get('/inspirations/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.inspirations).toHaveLength(0)
    })

    test('regular user cannot delete a inspiration', async function() {

        const responce = await request(app)
        .delete('/inspirations/1')
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(401)
        expect(responce.body.message).toBe('Sorry. You are not an administrator')

    })
})
