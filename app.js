const express = require("express");
const {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId} = require('./controllers/index.js')
const {handleCustomErrors, handlePsqlErrors} = require('./error-handlers/errors.index.js')

app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);








app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;