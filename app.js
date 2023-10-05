const express = require("express");
const {getTopics, getEndPoints, getAllArticles, getArticleById, patchArticle} = require('./controllers/index.js')
const {handleCustomErrors, handlePsqlErrors, handle500Errors} = require('./error-handlers/errors.index.js')

app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticle);





app.use(handleCustomErrors);

app.use(handlePsqlErrors);

// app.use(handle500Errors);

module.exports = app;