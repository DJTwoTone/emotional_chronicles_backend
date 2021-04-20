// You need a database called emo-chron-test
// Seed it with the testing-data.psql file

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');
const Prompts = require('../../models/prompts');


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
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('What is your number one goal this year?', true)`
        )

        await db.query(
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('What are you most grateful for?', true)`
        )

        await db.query(
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('Are you content?', true)`
        )

        await db.query(
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('What is your best memory of last year?', false)`
        )

        await db.query(
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('What was the last major accomplishment you had?', false)`
        )

        await db.query(
            `INSERT INTO prompts_list (prompt, flagged)
            VALUES ('What possession could you not live without?', false)`
        )


    } catch (error) {
        console.error('Before Each',error);
    }
})

afterEach(async function() {
    try {
        await db.query('DELETE FROM users')
        await db.query('DELETE FROM prompts_list')
        //OMG!!! NEVER EVER FORGET THIS!!!
        await db.query('ALTER SEQUENCE prompts_list_id_seq RESTART WITH 1')

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


describe('test GET routes for prompts', () => {

    test('gets a single prompt', async function() {

        const responce = await request(app)
        .get('/prompts')

        expect(responce.body).toHaveProperty('prompts');
        expect(responce.body.prompts).toHaveLength(1)

    })

    test('gets multiple prompts', async function() {

        const responce = await request(app)
        .get('/prompts?num=3')

        expect(responce.body).toHaveProperty('prompts');
        expect(responce.body.prompts).toHaveLength(3)

    })

    test('gets flagged prompts', async function() {

        const responce = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body).toHaveProperty('prompts');
        expect(responce.body.prompts).toHaveLength(3)

    })
})


//There are currently 6 prompts; 3 flagged and 3 approved
describe('test POST route for prompts', () => {

    test('adds a prompt from a user', async function() {
        //the added prompt should be flagged
        
        const responce = await request(app)
        .post('/prompts')
        .send({
            prompt: 'What are you grateful for?',
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })
        
        expect(responce.body).toHaveProperty('prompt')
        
        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })
        
        expect(flagged.body.prompts).toHaveLength(4)
        
        
    })
    
    test('adds a prompt from a admin', async function() {
        //the added prompt should not be flagged
        
        const responce = await request(app)
        .post('/prompts')
        .send({
            prompt: 'What are you grateful for?',
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body).toHaveProperty('prompt')

        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.prompts).toHaveLength(3)


    })
})

//There are currently 6 prompts; 3 flagged and 3 approved
describe('test PATCH route for prompts', () => {

    //the flagged length should be 2
    test('flip a flagged prompt to approved', async function() {

        await request(app)
        .patch('/prompts/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.prompts).toHaveLength(2)
    })

    //the flagged length should be 4
    test('flip an approved prompt to flagged', async function() {

        await request(app)
        .patch('/prompts/4')
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.prompts).toHaveLength(4)
    })
})

describe('test PATCH route for prompts', () => {

    //the flagged length should be 2 after deleting #1
    test('delete a single prompt', async function() {

        const responce = await request(app)
        .delete('/prompts/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(responce.body.message).toBe('The prompt has been deleted')
        expect(responce.statusCode).toBe(200)

        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.prompts).toHaveLength(2)
    })

    //the flagged length should be 0 after deleting all flagged
    test('delete multiple prompts', async function() {

        await request(app)
        .delete('/prompts/1')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })
        
        await request(app)
        .delete('/prompts/2')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        await request(app)
        .delete('/prompts/3')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        const flagged = await request(app)
        .get('/prompts/flagged')
        .send({
            _token: testData.admin.token
        })
        .set({ Authorization: `Bearer ${testData.admin.token}` })

        expect(flagged.body.prompts).toHaveLength(0)
    })

    test('regular user cannot delete a prompt', async function() {

        const responce = await request(app)
        .delete('/prompts/1')
        .send({
            _token: testData.user.token
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(401)
        expect(responce.body.message).toBe('Sorry. You are not an administrator')

    })
})
