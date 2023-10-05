const db = require("../db/connection.js");

exports.updateArticle = (article_id, inc_votes) => {
    // const checkForArticle = db.query(
    //     `
    //     SELECT * FROM article
    //     WHERE article_id = $1;
    //     `, [article_id]
    // )

    // const update = db.query(
    //     `
    //     UPDATE articles
    //     SET votes = votes + $1
    //     WHERE article_id = $2
    //     RETURNING *;
    //     `, [inc_votes, article_id]
    // )
    // return Promise.all([checkForArticle, update])
    // .then((promiseResults) => {
    //     console.log(promiseResults[0]);
    //     console.log(promiseResults[1]);
    //     if(promiseResults[0].rows.length === 0) {
    //         return Promise.reject({
    //             status: 404,
    //             msg: 'Not found'
    //         })
    //     }
    //     const updatedArticle = promiseResults[1];
    //     return updatedArticle;
    // })

    return db.query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [inc_votes, article_id]
    ).then((res) => {
        const updatedArticle = res.rows[0];
        return updatedArticle;
    })
}