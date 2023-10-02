const {fetchTopics} = require('../models/index.js')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}