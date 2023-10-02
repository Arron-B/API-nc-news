const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('resolves with 200 status code and returns correct topic data', () => {
        return request(app).get('/api/topics').expect(200)
        .then((res) => {
            const topicsArray = res.body.topics;
            expect(topicsArray).toHaveLength(3);
            topicsArray.forEach((topic) => {
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
            })
        })
    });
})

describe('GET /api', () => {
    test('resolves with status code 200 and returns an accurate JSON object detailing all end points', () => {
        const endPoints = require('../endpoints.json')
        return request(app).get('/api').expect(200).then((res) => {
            const endPointResponse = JSON.parse(res.text)
            expect(endPointResponse.endPoints).toEqual(endPoints)
        })
    
    });
})

describe('GET api/articles/:article_id', () => {
    test('resolves with a status 200 and the correct article and properties', () => {
        return request(app).get('/api/articles/2').expect(200).then((res) => {
            const article = res.body.article
            const keys = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
            expect(keys.every(key => article.hasOwnProperty(key))).toBe(true)
            expect(article.article_id).toBe(2)
            expect(article.title).toBe('Sony Vaio; or, The Laptop')
        })
    });
})

