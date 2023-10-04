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

    test('responds with status 404 and appropriate message when given a valid, but non-existent article id', () => {
        return request(app).get('/api/articles/199').expect(404).then((res) => {
            expect(res.body.msg).toBe('article does not exist');
        })
    });

    test('responds with status 400 and appropriate message when given an invalid article id', () => {
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

describe('GET /api/articles/:article_id/comments', () => {
    test('responds with status 200 and sends comments with correct keys and values', () => {
        return request(app).get('/api/articles/9/comments').expect(200).then((res) => {
            const comments = res.body.comments;
            const expectComment = {
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 16,
                author: "butter_bridge",
                article_id: 9,
                created_at: "2020-04-06T12:17:00.000Z",
              }
            
            expect(comments).toEqual(expect.arrayContaining([expect.objectContaining(expectComment)]))
        }) 
    });

    test('does not send comments from other articles, sends all comments for requested article', () => {
        return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
            const comments = res.body.comments;
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
                expect(comment.article_id).toBe(1)
            })
        })
    });

    test('comments are sorted by date with most recent first', () => {
        return request(app).get('/api/articles/1/comments')
        .then((res) => {
            const comments = res.body.comments;
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('responds with status 404 and appropriate message when given a valid, but non-existent article id', () => {
        return request(app).get('/api/articles/83/comments').expect(404).then((res) => {
            expect(res.body.msg).toBe('Article does not exist');
        })
    });

    test('responds with status 204 when given a valid article_id that has no associated comments ', () => {
        return request(app).get('/api/articles/2/comments').expect(204)
    });

    test('responds with status 400 and appropriate message when given a invalid article id', () => {
        return request(app).get('/api/articles/pikachu/comments').expect(400).then((res) => {
            expect(res.body.msg).toBe('Bad request')
        })
    });
});