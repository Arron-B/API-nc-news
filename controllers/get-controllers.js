const { fetchCommentsByArticleId } = require('../models/get-models.js')
const {fetchTopics, fetchAllArticles} = require('../models/index.js')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}

exports.getEndPoints = (req, res) => {
    const endPoints = require('../endpoints.json')

    return res.status(200).send({ endPoints })
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}