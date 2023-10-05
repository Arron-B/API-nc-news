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

describe('PATCH /api/articles/:article_id', () => {
    test('resolves with status 200 and returns an updated article with an added vote', () => {
        const newVote = {inc_votes: 2};
        return request(app).patch('/api/articles/1').expect(200).send(newVote).then((res) => {
            const updatedArticle = res.body.article;
            expect(updatedArticle).toEqual(expect.objectContaining({ 
                article_id: 1, title: 'Living in the shadow of a great man', topic: 'mitch', author: 'butter_bridge', body: 'I find this existence challenging', created_at: expect.any(String), votes: 102, article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
             }))
        })
    });
    test('The patched article is changed in the database' , () => {
        const newVote = {inc_votes: 2};
        return request(app).patch('/api/articles/1').send(newVote).then((res) => {
            return db.query(
                `
                SELECT votes FROM articles
                WHERE article_id = 1 
                `
            ).then((res) => {
                const votes = res.rows[0].votes;
                expect(votes).toBe(102);
            })
        })
    })

    test('The patch works for decrementing votes on an article' , () => {
        const newVote = {inc_votes: -2};
        return request(app).patch('/api/articles/1').send(newVote).then((res) => {
            return db.query(
                `
                SELECT votes FROM articles
                WHERE article_id = 1 
                `
            ).then((res) => {
                const votes = res.rows[0].votes;
                expect(votes).toBe(98);
            })
        })
    })

    test('rejects with status 400 when not given inc_votes in the body', () => {
        const newVote = {someThingElse: 2};
        return request(app).patch('/api/articles/1').send(newVote).expect(400)
    });

    test('rejects with status 400 when not given inc_votes with non number property', () => {
        const newVote = {inc_votes: 'plus one million votes'};
        return request(app).patch('/api/articles/1').send(newVote).expect(400)
    });

    test("rejects with status 404 when given a valid article number that doesn't exist", () => {
        const newVote = {inc_votes: 2};
        return request(app).patch('/api/articles/302').send(newVote).expect(404)
    });

    test('rejects with status 400 when given an article_id that is not a number', () => {
        const newVote = {inc_votes: 'plus one million votes'};
        return request(app).patch('/api/articles/somearticle').send(newVote).expect(400)
    });
});
