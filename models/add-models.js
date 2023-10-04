const db = require('../db/connection.js')

exports.insertComment = (username, newComment, article_id) => {
    return db.query(
        `INSERT INTO comments (created_at, author, body, article_id)
        VALUES (NOW(), $1, $2, $3)
        RETURNING body;`, [username, newComment, article_id]
    ).then((result) => {
        const comment = result.rows[0].body;
        return comment;
    })
}

// const insertToTable = db.query(
//     `INSERT INTO comments (created_at, author, body, article_id)
//     VALUES (NOW(), $1, $2, $3)
//     RETURNING body;`, [username, newComment, article_id]);

// const checkForArticleId = db.query(
//     `SELECT * FROM articles
//     WHERE article_id = $1`, [article_id]);

// Promise.all([insertToTable, checkForArticleId])
// .then(([insertRes, checkForArticleId]) => {
//     console.log(insertRes);
//     if(checkForArticleId.rows.length === 0) {
//         return Promise.reject({
//             status: 400,
//             msg: 'Bad request'
//         })
//     }
//     const comment = insertRes.rows[0].body;
//     return comment;
// })