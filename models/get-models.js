const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
        .then((res) => {
            const allTopics = res.rows
            return allTopics;
        })
}

exports.fetchArticleById = (article_id) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, [article_id]
        ).then((res) => {
        const article = res.rows[0]
        return article
    })
}