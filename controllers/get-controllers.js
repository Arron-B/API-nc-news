const {fetchTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require('../models/index.js')

exports.getTopics = (req, res,next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch(err => {
        next(err)
    });
}

exports.getEndPoints = (req, res, next) => {
    const endPoints = require('../endpoints.json')

    return res.status(200).send({ endPoints })
    .catch(err => {
        next(err)
    });
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(err => {
        next(err)
    });
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}