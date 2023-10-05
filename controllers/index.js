const {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId} = require('./get-controllers.js')
const {addComment, patchArticle} = require('./add-controllers.js')

module.exports = {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId, addComment, patchArticle};