const express = require("express");
const {getTopics, getEndPoints, getArticleById} = require('./controllers/index.js')
const {handleCustomErrors} = require('./error-handlers/errors.index.js')

app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);

app.get('/api/articles/:article_id', getArticleById);








app.use(handleCustomErrors);

module.exports = app;