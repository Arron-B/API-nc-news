const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
	test("resolves with 200 status code and returns correct topic data", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then((res) => {
				const topicsArray = res.body.topics;
				expect(topicsArray).toHaveLength(3);
				topicsArray.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});

describe("GET /api", () => {
	test("resolves with status code 200 and returns an accurate JSON object detailing all end points", () => {
		const endPoints = require("../endpoints.json");
		return request(app)
			.get("/api")
			.expect(200)
			.then((res) => {
				const endPointResponse = JSON.parse(res.text);
				expect(endPointResponse.endPoints).toEqual(endPoints);
			});
	});
});

describe("GET api/articles/:article_id", () => {
	test("resolves with a status 200 and the correct article keys and values", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then((res) => {
				const article = res.body.article;
				expect(article).toEqual(
					expect.objectContaining({
						article_id: 1,
						title: "Living in the shadow of a great man",
						topic: "mitch",
						author: "butter_bridge",
						body: "I find this existence challenging",
						created_at: expect.any(String),
						votes: 100,
						article_img_url:
							"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
						comment_count: 11,
					})
				);
			});
	});

	test("Has a comment_count of 0 if the article has no associated comments", () => {
		return request(app)
			.get("/api/articles/2")
			.expect(200)
			.then((res) => {
				const article = res.body.article;
				expect(article.comment_count).toBe(0);
			});
	});

	test("responds with status 404 and appropriate message when given a valid, but non-existent article id", () => {
		return request(app)
			.get("/api/articles/199")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("article does not exist");
			});
	});

	test("responds with status 400 and appropriate message when given an invalid article id", () => {
		return request(app)
			.get("/api/articles/steve")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Bad request");
			});
	});
});

describe("GET /api/articles", () => {
	test("resolves with 200 status code and returns correct articles with correct key types", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((res) => {
				const articlesArray = res.body.articles;
				expect(articlesArray).toHaveLength(13);
				articlesArray.forEach((article) => {
					expect(typeof article.title).toBe("string");
					expect(typeof article.topic).toBe("string");
					expect(typeof article.topic).toBe("string");
					expect(typeof article.author).toBe("string");
					expect(typeof article.article_img_url).toBe("string");
					expect(typeof article.created_at).toBe("string");
					expect(typeof article.votes).toBe("number");
					expect(typeof article.comment_count).toBe("number");
					expect(article.body).toBe(undefined);
					if (article.article_id === 1) {
						expect(article.comment_count).toBe(11);
					}
				});
			});
	});

	test("articles are sorted by date in descending order", () => {
		return request(app)
			.get("/api/articles")
			.then((res) => {
				const articlesArray = res.body.articles;
				expect(articlesArray).toBeSortedBy("created_at", { descending: true });
			});
	});

	test("articles can be queried to show articles of a topic", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then((res) => {
				const articlesArray = res.body.articles;
				expect(articlesArray).toHaveLength(12);
				articlesArray.forEach((article) => {
					expect(article).toEqual(
						expect.objectContaining({
							topic: "mitch",
						})
					);
				});
			});
	});

	test("Should return 404 and appropriate message for a topic that does not exist", () => {
		return request(app)
			.get("/api/articles?topic=puppy")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Topic does not exist");
			});
	});

	test("Should return 404 and appropriate message for a topic that does exist, but has no associated articles", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("There are no articles of this topic");
			});
	});

	test("Articles can be sorted by any column, defaulting to descending", (columns = [
		"title",
		"topic",
		"author",
		"article_img_url",
		"article_id",
		"votes",
		"comment_count",
		"created_at",
	]) => {
		const promises = columns.map((column) => {
			return request(app)
				.get(`/api/articles?sort_by=${column}`)
				.then((res) => {
					const articles = res.body.articles;
					return articles;
				});
		});
		return Promise.all(promises).then((promiseResults) => {
			columns.forEach((column, i) => {
				expect(promiseResults[i]).toBeSortedBy(column, { descending: true });
			});
		});
	});

	test("Articles can be sorted by any column ascending", (columns = [
		"title",
		"topic",
		"author",
		"article_img_url",
		"article_id",
		"votes",
		"comment_count",
		"created_at",
	]) => {
		const promises = columns.map((column) => {
			return request(app)
				.get(`/api/articles?sort_by=${column}&order=asc`)
				.then((res) => {
					const articles = res.body.articles;
					return articles;
				});
		});
		return Promise.all(promises).then((promiseResults) => {
			columns.forEach((column, i) => {
				expect(promiseResults[i]).toBeSortedBy(column, { ascending: true });
			});
		});
	});

	test("Rejects with 400 and appropriate message if sort_by is not a valid column.  This also protects from sql injection", () => {
		return request(app)
			.get(`/api/articles?sort_by=notAcolumn`)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid sort by query");
			});
	});

	test("Rejects with 400 and appropriate message if order is not asc or desc.  This also protects from sql injection", () => {
		return request(app)
			.get(`/api/articles?order=someBadStuff`)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid order query");
			});
	});
});

describe("GET /api/articles/:article_id/comments", () => {
	test("responds with status 200 and sends a comment with correct keys and values", () => {
		return request(app)
			.get("/api/articles/9/comments")
			.expect(200)
			.then((res) => {
				const comments = res.body.comments;
				const expectComment = {
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 16,
					author: "butter_bridge",
					article_id: 9,
					created_at: "2020-04-06T12:17:00.000Z",
				};

				expect(comments).toEqual(
					expect.arrayContaining([expect.objectContaining(expectComment)])
				);
			});
	});

	test("does not send comments from other articles, sends all comments for requested article, each containing correct keys and property types", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then((res) => {
				const comments = res.body.comments;
				expect(comments).toHaveLength(11);
				comments.forEach((comment) => {
					expect(comment.article_id).toBe(1);
					expect(typeof comment.body).toBe("string");
					expect(typeof comment.votes).toBe("number");
					expect(typeof comment.author).toBe("string");
					expect(typeof comment.article_id).toBe("number");
					expect(typeof comment.created_at).toBe("string");
					expect(typeof comment.comment_id).toBe("number");
				});
			});
	});

	test("comments are sorted by date with most recent first", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.then((res) => {
				const comments = res.body.comments;
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});

	test("responds with status 404 and appropriate message when given a valid, but non-existent article id", () => {
		return request(app)
			.get("/api/articles/83/comments")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Article does not exist");
			});
	});

	test("responds with status 200 when given a valid article_id that has no associated comments, no response message required ", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then((res) => {
				const comments = res.body.comments;
				expect(comments).toHaveLength(0);
			});
	});

	test("responds with status 400 and appropriate message when given a invalid article id", () => {
		return request(app)
			.get("/api/articles/pikachu/comments")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Bad request");
			});
	});
});
describe("POST /api/articles/:article_id/comments", () => {
	test("resolves with status 201 and returns correct comment object.", () => {
		const newComment = {
			username: "lurker",
			body: "not a bad read",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then((res) => {
				const comment = res.body.comment;
				expect(comment).toEqual(
					expect.objectContaining({
						comment_id: 19,
						body: "not a bad read",
						article_id: 1,
						author: "lurker",
						votes: 0,
						created_at: expect.any(String),
					})
				);
			});
	});

	test("inserted comment is in database with correct keys and values", () => {
		const newComment = {
			username: "lurker",
			body: "not a bad read",
		};
		return request(app)
			.post("/api/articles/2/comments")
			.send(newComment)
			.then((res) => {
				return db
					.query(
						`SELECT * FROM comments
                WHERE article_id = 2;`
					)
					.then((res) => {
						const comment = res.rows[0];
						expect(comment).toEqual(
							expect.objectContaining({
								comment_id: 19,
								body: "not a bad read",
								article_id: 2,
								author: "lurker",
								votes: 0,
								created_at: expect.any(Date),
							})
						);
					});
			});
	});

	test("rejects with status 400 and appropriate message when there is no username (user is not logged in)", () => {
		const newComment = {
			body: "not a bad read",
		};
		return request(app)
			.post("/api/articles/2/comments")
			.send(newComment)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Cannot comment without logging in");
			});
	});

	test("rejects with status 400 and appropriate message when no comment is provided", () => {
		const newComment = {
			username: "lurker",
		};
		return request(app)
			.post("/api/articles/2/comments")
			.send(newComment)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Cannot submit an empty comment");
			});
	});

	test("rejects with status 400 when given an article_id that is not a number", () => {
		const newComment = {
			username: "lurker",
			body: "not a bad read",
		};
		return request(app)
			.post("/api/articles/hello/comments")
			.send(newComment)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Article id is invalid. Must be a number.");
			});
	});

	test("rejects with status 404 and appropraite message when trying to post a comment to a valid article_id that doesn't exist", () => {
		const newComment = {
			username: "lurker",
			body: "not a bad read",
		};
		return request(app)
			.post("/api/articles/209/comments")
			.send(newComment)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("No article with this id");
			});
	});
});
describe("PATCH /api/articles/:article_id", () => {
	test("resolves with status 200 and returns an updated article with an added vote", () => {
		const newVote = { inc_votes: 2 };
		return request(app)
			.patch("/api/articles/1")
			.expect(200)
			.send(newVote)
			.then((res) => {
				const updatedArticle = res.body.article;
				expect(updatedArticle).toEqual(
					expect.objectContaining({
						article_id: 1,
						title: "Living in the shadow of a great man",
						topic: "mitch",
						author: "butter_bridge",
						body: "I find this existence challenging",
						created_at: expect.any(String),
						votes: 102,
						article_img_url:
							"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					})
				);
			});
	});
	test("The patched article is changed in the database", () => {
		const newVote = { inc_votes: 2 };
		return request(app)
			.patch("/api/articles/1")
			.send(newVote)
			.then((res) => {
				return db.query(
					`
                SELECT votes FROM articles
                WHERE article_id = 1 
                `
				);
			})
			.then((res) => {
				const votes = res.rows[0].votes;
				expect(votes).toBe(102);
			});
	});

	test("The patch works for decrementing votes on an article", () => {
		const newVote = { inc_votes: -2 };
		return request(app)
			.patch("/api/articles/1")
			.send(newVote)
			.then((res) => {
				return db
					.query(
						`
                SELECT votes FROM articles
                WHERE article_id = 1 
                `
					)
					.then((res) => {
						const votes = res.rows[0].votes;
						expect(votes).toBe(98);
					});
			});
	});

	test("rejects with status 400 and appropriate message when not given inc_votes in the body", () => {
		const newVote = { someThingElse: 2 };
		return request(app)
			.patch("/api/articles/1")
			.send(newVote)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("No vote provided");
			});
	});

	test("rejects with status 400 and appropriate message when not given inc_votes with non number property", () => {
		const newVote = { inc_votes: "plus one million votes" };
		return request(app)
			.patch("/api/articles/1")
			.send(newVote)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Vote must be a number");
			});
	});

	test("rejects with status 404 and appropriate message when given a valid article number that doesn't exist", () => {
		const newVote = { inc_votes: 2 };
		return request(app)
			.patch("/api/articles/302")
			.send(newVote)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Article does not exist");
			});
	});

	test("rejects with status 400 and appropriate message when given an article_id that is not a number", () => {
		const newVote = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/somearticle")
			.send(newVote)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Article id is invalid. Must be a number.");
			});
	});
});

describe("GET api/users", () => {
	test("resolves with status 200 and list of all users with correct key value pairs", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((res) => {
				const users = res.body.users;
				expect(users).toHaveLength(4);
				expect(users).toEqual(
					expect.arrayContaining([
						{
							username: "butter_bridge",
							name: "jonny",
							avatar_url:
								"https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
						},
						{
							username: "icellusedkars",
							name: "sam",
							avatar_url:
								"https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
						},
						{
							username: "rogersop",
							name: "paul",
							avatar_url:
								"https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
						},
						{
							username: "lurker",
							name: "do_nothing",
							avatar_url:
								"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
						},
					])
				);
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("resolves with status 204 and removes correct comment from database", () => {
		return db
			.query(
				`
            SELECT * FROM comments
            WHERE comment_id = 1;
            `
			)
			.then((res) => {
				expect(res.rowCount).toBe(1);
				return request(app).delete("/api/comments/1").expect(204);
			})
			.then(() => {
				return db.query(`
                 SELECT * FROM comments
                 WHERE comment_id = 1;
            `);
			})
			.then((res) => {
				expect(res.rowCount).toBe(0);
			});
	});
	test("error status 404 Not Found when trying to delete a comment that does not exist", () => {
		return request(app)
			.delete("/api/comments/29")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Not Found");
			});
	});
	test("error status 400 Invalid ID when comment_id is not a number", () => {
		return request(app)
			.delete("/api/comments/commentIregret")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid ID: Must be a number");
			});
	});
});
