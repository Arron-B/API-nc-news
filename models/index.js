const {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require('./get-models.js')

const {insertComment, updateArticle} = require('./add-models.js')

module.exports = {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertComment, updateArticle}