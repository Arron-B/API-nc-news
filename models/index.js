const {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, fetchAllUsers} = require('./get-models.js')

const {insertComment, updateArticle} = require('./add-models.js')

module.exports = {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertComment, updateArticle, fetchAllUsers}