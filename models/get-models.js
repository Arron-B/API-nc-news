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

exports.fetchAllArticles = () => {
    return db.query(
        `SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.article_id) AS INT) comment_count
        FROM articles a 
        LEFT JOIN comments c 
        ON a.article_id = c.article_id
        GROUP BY a.article_id
        ORDER BY a.created_at DESC;`).then((res) => {
        const allArticles = res.rows
        return allArticles;
    })
}

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT comment_id, a.article_id
        FROM comments c
        INNER JOIN articles a
        ON a.article_id = c.article_id
        WHERE c.article_id = $1;`, [article_id]).then((res) => {
        const comments = res.rows
        return comments;
    })
}