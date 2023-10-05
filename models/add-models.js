const db = require('../db/connection.js')

exports.insertComment = (username, newComment, article_id) => {
    return db.query(
    `SELECT * FROM articles
    WHERE article_id = $1`, [article_id]).then((res) => {
        if(res.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Article does not exist'
            })
        }
        return db.query(
            `INSERT INTO comments (created_at, author, body, article_id)
            VALUES (NOW(), $1, $2, $3)
            RETURNING body;`, [username, newComment, article_id]
        ).then((res) => {
            const comment = res.rows[0].body;
            return comment;
        })
    })
}
