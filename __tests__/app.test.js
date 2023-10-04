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

    test('responds with status 404 and appropriate message when give a valid, but non-existent article id', () => {
        return request(app).get('/api/articles/199').expect(404).then((res) => {
            expect(res.body.msg).toBe('article does not exist');
        })
    });

    test('responds with status 400 and appropriate message when give a valid, but non-existent article id', () => {
        return request(app).get('/api/articles/steve').expect(400).then((res) => {
            expect(res.body.msg).toBe('Bad request')
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

// describe('POST /api/articles/:article_id/comments', () => {
//     test('resolves with status 201 and correct comment object', () => {
//         const newComment = {
//             username: 'lurker',
//             body: 'not a bad read'
//         }
//         const date = Date();
//         console.log(date);
//         return request(app).post('/api/articles/1/comments').send(newComment).expect(201).then((res) => {
//             const comment = res.body.comment;
//             expect(comment).toMatchObject(newComment);
//         })
//     });
// });