const {fetchTopics} = require('../models/index.js')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}

exports.getEndPoints = (req, res) => {
    const endPoints = require('../endpoints.json')

    return res.status(200).send({ endPoints })
}