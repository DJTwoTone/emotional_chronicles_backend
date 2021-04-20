//You need a database called emo-chron-test
// Seed it with the testing-data.psql file

const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');
const Diaries = require('../../models/diaries');

const nock = require('nock')


const API_KEY = process.env.API_KEY;
const gettysburg = "Four score and seven years ago our fathers brought forth, upon this continent, a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived, and so dedicated, can long endure."
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

        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '111Kiicking ass and taking names', '2020-12-14T15:00:00.000Z', 4, 5, 0.1234, 0.2345, 0.3456, 0.4567, 0.5678, 0.6789, 0.789, 0.258, 0.369)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '222Kiicking ass and taking names', '2021-01-14T15:00:00.000Z', 5, 4, 0.1234, 0.2345, 0.3456, 0.4567, 0.5678, 0.6789, 0.789, 0.258, 0.369)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '333Kiicking ass and taking names', '2021-02-14T15:00:00.000Z', 6, 6, 0.369, 0.1234, 0.258, 0.3456, 0.2345, 0.346, 0.4567, 0.2345, 0.3456)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '444Kiicking ass and taking names', '2021-03-01T15:00:00.000Z', 4, 5, 0.679, 0.3258, 0.467, 0.5678, 0.6789, 0.235, 0.3456, 0.5678, 0.278)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '555Kiicking ass and taking names', '2021-03-02T15:00:00.000Z', 5, 4, 0.134, 0.3969, 0.534, 0.7389, 0.2758, 0.369, 0.1234, 0.2345, 0.2345)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '666Kiicking ass and taking names', '2021-03-03T15:00:00.000Z', 6, 6, 0.1234, 0.2345, 0.3456, 0.4567, 0.5678, 0.6789, 0.789, 0.258, 0.369)`
        )
    
        await db.query(
            `INSERT INTO diary_entries ( username, entry, date, prompt_id, inspiration_id, joy, no_emotion, sadness, fear, surprise, anger, disgust, anticipation, trust)
            VALUES ('testuser', '777Kiicking ass and taking names', '2021-03-04T15:00:00.000Z', 4, 5, 0.568, 0.6789, 0.789, 0.4567, 0.5678, 0.789, 0.7891, 0.2586, 0.3691)`
        )

        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 1)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 1)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 1)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 1)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 2)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 2)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 2)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 2)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 3)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 3)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 3)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 3)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 4)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 4)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 4)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 4)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 5)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 5)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 5)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 5)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 6)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 6)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 6)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 6)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('afraid', 7)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('nervous', 7)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('petrified', 7)`
            )
        await db.query(
            `INSERT INTO entries_list_emotions (emotion, diary_entry_id)
            VALUES ('uptight', 7)`
            )

    } catch (error) {
        console.error('Before Each',error);
    }
})

afterEach(async function() {
    try {
        await db.query('DELETE FROM users')
        await db.query('DELETE FROM entries_list_emotions CASCADE')
        await db.query('DELETE FROM diary_entries CASCADE')
        await db.query('ALTER SEQUENCE diary_entries_id_seq RESTART WITH 1')
        await db.query('DELETE FROM prompts_list')
        await db.query('ALTER SEQUENCE prompts_list_id_seq RESTART WITH 1')
        await db.query('DELETE FROM inspirations')
        await db.query('ALTER SEQUENCE inspirations_id_seq RESTART WITH 1')
        await db.query('DELETE FROM emotions_list')

        testData = {}
    } catch (error) {
        console.error('After Each', error);
    }
})

afterAll(async function() {
    try {
        await db.query('DELETE FROM users')
        await db.query('DELETE FROM entries_list_emotions CASCADE')
        await db.query('DELETE FROM diary_entries CASCADE')
        await db.query('ALTER SEQUENCE diary_entries_id_seq RESTART WITH 1')
        await db.query('DELETE FROM prompts_list')
        await db.query('ALTER SEQUENCE prompts_list_id_seq RESTART WITH 1')
        await db.query('DELETE FROM inspirations')
        await db.query('ALTER SEQUENCE inspirations_id_seq RESTART WITH 1')
        await db.query('DELETE FROM emotions_list')
        
        await db.end()
    } catch (error) {
        console.error('After All', error)
    }
})

describe("test GET routes for diaries", () => {

    test("check if a diary entry has been made for a day", async function() {

        const responceTrue = await request(app)
        .get(`/diaries/${testData.user.username}/2021-03-04/check`)
        .set({ Authorization: `Bearer ${testData.user.token}` });

        expect(responceTrue.body.entered).toBe(true);
        expect(responceTrue.body.date).toBe('2021-03-04');
        
        const responceFalse = await request(app)
        .get(`/diaries/${testData.user.username}/2019-03-04/check`)
        .send({_token: testData.user.token})
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responceFalse.body.entered).toBe(false);
        expect(responceFalse.body.date).toBe('2019-03-04');
    })

    test("get a diary entry for a single day", async function() {

        const responce = await request(app)
        .get(`/diaries/${testData.user.username}/2021-03-04`)
        .set({ Authorization: `Bearer ${testData.user.token}` });

        expect(responce.statusCode).toBe(200);
        expect(responce.body.entry).toHaveProperty('entry')
        expect(responce.body.entry.entry).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('date')
        expect(responce.body.entry.date).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('prompt')
        expect(responce.body.entry.prompt).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('inspiration')
        expect(responce.body.entry.inspiration).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('emotions')
        expect(responce.body.entry.emotions).toEqual(expect.any(Array))
        expect(responce.body.entry).toHaveProperty('joy')
        expect(responce.body.entry.joy).toEqual(expect.any(Number))
        expect(responce.body.entry).toHaveProperty('surprise')
        expect(responce.body.entry.surprise).toEqual(expect.any(Number))
        expect(responce.body.entry).toHaveProperty('trust')
        expect(responce.body.entry.trust).toEqual(expect.any(Number))
    })

    test("get a month of user entries", async function() {

        const responce = await request(app)
        .get(`/diaries/${testData.user.username}/month/2021-03-02`)
        .set({ Authorization: `Bearer ${testData.user.token}` });

        expect(responce.statusCode).toBe(200);
        expect(responce.body.month).toEqual(expect.any(Array));
        expect(responce.body.month.length).toBe(4);
        expect(responce.body.month[0].username).toBe('testuser')
        expect(responce.body.month[2].username).toBe('testuser')

    })

    test("get all the entries for a single user", async function() {

        const responce = await request(app)
        .get(`/diaries/${testData.user.username}`)
        .set({ Authorization: `Bearer ${testData.user.token}` });

        expect(responce.statusCode).toBe(200);
        expect(responce.body.entries).toEqual(expect.any(Array));
        expect(responce.body.entries.length).toBe(7);
        expect(responce.body.entries[0].username).toBe('testuser');
        expect(responce.body.entries[6].username).toBe('testuser');


    })


})


describe("test POST routes for diaries", () =>{

    test('adds and entry to the diary', async function() {
        
        nock('https://api.symanto.net', {
            reqheaders: {
                'x-api-key': API_KEY, 
                'Content-Type': 'application/json'
            }
          })
        .post('/ekman-emotion?all=true', JSON.stringify([{
            "text": gettysburg,
            "language":"en"
        }]))        
        .reply(200, [{
            "id": null,
            "predictions": [
                {
                    "prediction": "joy",
                    "probability": 0.123
                },
                {
                    "prediction": "no-emotion",
                    "probability": 0.234
                },
                {
                    "prediction": "sadness",
                    "probability": 0.345
                },
                {
                    "prediction": "fear",
                    "probability": 0.543
                },
                {
                    "prediction": "surprise",
                    "probability": 0.963
                },
                {
                    "prediction": "anger",
                    "probability": 0.741
                },
                {
                    "prediction": "disgust",
                    "probability": 0.753
                }

            ]
        }])
        
        const responce = await request(app)
        .post(`/diaries/${testData.user.username}`)
        .send({
            _token: testData.user.token,
            diaryentry: gettysburg,
            emotions: ['choleric','uptight','skeptical','petrified'],
            prompt_id: 1,
            inspiration_id: 1
        })
        .set({ Authorization: `Bearer ${testData.user.token}` })

        expect(responce.statusCode).toBe(200);
        expect(responce.body.entry).toHaveProperty('entry')
        expect(responce.body.entry.entry).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('date')
        expect(responce.body.entry.date).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('prompt')
        expect(responce.body.entry.prompt).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('inspiration')
        expect(responce.body.entry.inspiration).toEqual(expect.any(String))
        expect(responce.body.entry).toHaveProperty('emotions')
        expect(responce.body.entry.emotions).toEqual(expect.any(Array))
        expect(responce.body.entry).toHaveProperty('joy')
        expect(responce.body.entry.joy).toEqual(expect.any(Number))
        expect(responce.body.entry).toHaveProperty('surprise')
        expect(responce.body.entry.surprise).toEqual(expect.any(Number))
        expect(responce.body.entry).toHaveProperty('trust')
        expect(responce.body.entry.trust).toEqual(expect.any(Number))

    })




})