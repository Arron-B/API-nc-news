const {getTopics, getEndPoints, getAllArticles, getArticleById} = require('./get-controllers.js')
const {patchArticle} = require('./add-controllers.js')


module.exports = {getTopics, getEndPoints, getAllArticles, getArticleById, patchArticle};