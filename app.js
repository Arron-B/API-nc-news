const express = require("express");
const {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId, addComment} = require('./controllers/index.js')
const {handleCustomErrors, handlePsqlErrors} = require('./error-handlers/errors.index.js')

app = express();

app.use(express.json())

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', addComment);


app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;