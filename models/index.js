const db = require('../db/connection.js')
const {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require('./get-models.js')

const {insertComment, updateArticle} = require('./add-models.js')

const removeCommentFromDb = (comment_id) => {
    if(!/^\d+$/.test(comment_id)) {
        return Promise.reject({
            status: 400,
            msg: 'Invalid ID: Must be a number'
        })
    }
    return db.query(
        `SELECT * FROM comments
        WHERE comment_id = $1`, [comment_id]).then((res) => {
            if(res.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Not Found'
                })
            }
            return db.query(`
                DELETE FROM comments
                WHERE comment_id = $1;
                `, [comment_id])
        }
    )}
module.exports = {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertComment, updateArticle, removeCommentFromDb}

