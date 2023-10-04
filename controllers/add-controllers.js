const {insertComment} = require('../models/index.js')


exports.addComment = (req, res, next) => {
    const {body, username} = req.body
    const {article_id} = req.params
    insertComment(username, body, article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch((err) => next(err));
}