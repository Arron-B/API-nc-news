const db = require('../db/connection.js')

exports.insertComment = (username, newComment, article_id) => {
    if(!username) {
        return Promise.reject({
            status: 400,
            msg: 'Cannot comment without logging in'
        })
    }
    if(!newComment) {
        return Promise.reject({
            status: 400,
            msg: 'Cannot submit an empty comment'
        })
    }
    if(!/^\d+$/.test(article_id)) {
        return Promise.reject({
            status: 400,
            msg: 'Article id is invalid. Must be a number.'
        })
    }

    return db.query(
    `SELECT * FROM articles
    WHERE article_id = $1`, [article_id]).then((res) => {
        if(res.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: 'No article with this id'
            })
        }
        return db.query(
            `INSERT INTO comments (created_at, author, body, article_id)
            VALUES (NOW(), $1, $2, $3)
            RETURNING *;`, [username, newComment, article_id]
        ).then((res) => {
            const comment = res.rows[0];
            return comment;
        })
    })
}
