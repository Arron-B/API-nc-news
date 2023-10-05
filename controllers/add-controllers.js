const {insertComment, updateArticle} = require('../models/index.js')


exports.addComment = (req, res, next) => {
    const {body, username} = req.body
    const {article_id} = req.params
    insertComment(username, body, article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch((err) => next(err));
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
    }).catch((err) => {
        next(err)
    })
}