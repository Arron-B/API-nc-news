const {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId,getAllUsers} = require('./get-controllers.js')
const {addComment, patchArticle} = require('./add-controllers.js')
const {removeCommentFromDb} = require('../models/index.js')


const deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentFromDb(comment_id).then(() => {
        res.status(204).send()
    }).catch(err => {
        next(err)
    }) 
}



module.exports = {getTopics, getEndPoints, getAllArticles, getArticleById, getCommentsByArticleId, addComment, patchArticle, getAllUsers, deleteComment};

