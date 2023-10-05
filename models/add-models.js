const db = require("../db/connection.js");

exports.updateArticle = (article_id, inc_votes) => {
    if(!inc_votes) {
        return Promise.reject({
            status: 400,
            msg: 'No vote provided'
        })
    }
    if(typeof inc_votes !== 'number') {
        return Promise.reject({
            status: 400,
            msg: 'Vote must be a number'
        })
    }
    if(!/^\d+$/.test(article_id)) {
        return Promise.reject({
            status: 400,
            msg: 'Article id is invalid. Must be a number.'
        })
    }

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