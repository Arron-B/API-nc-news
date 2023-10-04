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

describe('GET /api/articles', () => {
    test('resolves with 200 status code and returns correct articles with correct key types', () => {
        return request(app).get('/api/articles').expect(200)
        .then((res) => {
            const articlesArray = res.body.articles;
            expect(articlesArray).toHaveLength(13);
            articlesArray.forEach((article) => {
                expect(typeof article.title).toBe('string');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.author).toBe('string');
                expect(typeof article.article_img_url).toBe('string');
                expect(typeof article.created_at).toBe('string');
                expect(typeof article.votes).toBe('number');
                expect(typeof article.comment_count).toBe('number');
                expect(article.body).toBe(undefined);
                if(article.article_id === 1) {
                    expect(article.comment_count).toBe(11)
                }
            })
        })
    });

    test('articles are sorted by date in descending order', () => {
        return request(app).get('/api/articles')
        .then((res) => {
            const articlesArray = res.body.articles;
            expect(articlesArray).toBeSortedBy('created_at', {descending: true})
        })
    });
})

