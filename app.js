const express = require("express");
const {
	getTopics,
	getEndPoints,
	getAllArticles,
	getArticleById,
	getCommentsByArticleId,
	addComment,
	patchArticle,
	getAllUsers,
	deleteComment,
} = require("./controllers/index.js");
const {
	handleCustomErrors,
	handlePsqlErrors,
	handle500Errors,
} = require("./error-handlers/errors.index.js");
const cors = require("cors");

app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

// app.use(handle500Errors);

module.exports = app;
