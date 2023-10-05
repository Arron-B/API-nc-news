const {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require('./get-models.js')
const {updateArticle} = require('./add-models.js')

module.exports = {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, updateArticle}