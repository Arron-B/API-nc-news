const {insertComment} = require('../models/index.js')


exports.addComment = (req, res, next) => {
    const newComment = req.body
    insertComment(newComment).then((comment) => {
        res.status(201).send(comment)
    }).catch((err) => next(err));
}