const express = require("express");
const {getTopics, getEndPoints} = require('./controllers/index.js')
const {handleCustomErrors} = require('./error-handlers/errors.index.js')

app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndPoints);








app.use(handleCustomErrors);

module.exports = app;