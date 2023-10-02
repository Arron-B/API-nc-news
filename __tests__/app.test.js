const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('resolves with 200 status code', () => {
        return request(app).get('/api/topics').expect(200);
    });
})

    test('returns correct topic data', () => {
        return request(app).get('/api/topics').then((topics) => {
            const topicsArray = topics.body;
            topicsArray.forEach((topic) => {
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string')
            })
        })
});