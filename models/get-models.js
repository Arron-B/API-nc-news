const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
        .then((res) => {
            const allTopics = res.rows
            return allTopics;
        })
}

exports.fetchArticleById = (article_id) => {
    const idType = Number(article_id)
    // if (!idType === 'number') {
    //     return Promise.reject({
    //         status: 400,
    //         msg: 'Bad request'
    //     })
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, [article_id]
        ).then((res) => {
        const article = res.rows[0];
        if(!article) {
            return Promise.reject({
                status: 404,
                msg: 'article does not exist'
            })
        }
        return article
    })
}