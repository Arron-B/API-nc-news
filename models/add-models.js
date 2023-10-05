const db = require("../db/connection.js");

exports.updateArticle = (article_id, inc_votes) => {

    return db.query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [inc_votes, article_id]
    ).then((res) => {
        if(res.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Article does not exist'
            })
        }
        const updatedArticle = res.rows[0];
        return updatedArticle;
    })
}