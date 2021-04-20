// You need a database called emo-chron-test
// Seed it with the testing-data.psql file

const request = require('supertest');

const app = require('../../app');
const db = require('../../db');
const Emotions = require('../../models/emotions');

beforeEach(async function() {
    try {
       
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('afraid')`
        )
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('nervous')`
        )
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('petrified')`
        )
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('skeptical')`
        )
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('uptight')`
        )
        await db.query(
            `INSERT INTO emotions_list (emotion)
            VALUES ('choleric')`
        )


    } catch (error) {
        console.error('Before Each',error);
    }
})

afterEach(async function() {
    try {
        
        await db.query('DELETE FROM emotions_list')

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

describe('test GET routes for emotions', () => {

    test('gets a single emotion', async function() {

        const responce = await request(app)
        .get('/emotions')

        expect(responce.body).toHaveProperty('emotions');
        expect(responce.body.emotions).toHaveLength(1)

    })

    test('gets multiple emotions', async function() {

        const responce = await request(app)
        .get('/emotions?num=6')

        expect(responce.body).toHaveProperty('emotions');
        expect(responce.body.emotions).toHaveLength(6)

    })

})