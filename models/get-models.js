const db = require("../db/connection.js");

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;").then((res) => {
		const allTopics = res.rows;
		return allTopics;
	});
};

exports.fetchArticleById = (article_id) => {
	const idType = Number(article_id);
	return db
		.query(
			`SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.article_id) AS INT) comment_count
        FROM articles a
        LEFT JOIN comments c 
        ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY a.article_id;`,
			[article_id]
		)
		.then((res) => {
			const article = res.rows[0];
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: "article does not exist",
				});
			}
			return article;
		});
};

exports.fetchAllArticles = (topic, sort_by, order) => {
	const validOrders = {
		ASC: "ASC",
		DESC: "DESC",
		asc: "ASC",
		desc: "DESC",
	};

	const validSortBys = {
		title: "title",
		topic: "topic",
		author: "author",
		article_img_url: "article_img_url",
		article_id: "article_id",
		votes: "votes",
		comment_count: "comment_count",
		created_at: "created_at",
	};

	if (order && order in validOrders === false) {
		return Promise.reject({
			status: 400,
			msg: "Invalid order query",
		});
	}

	if (sort_by && sort_by in validSortBys === false) {
		return Promise.reject({
			status: 400,
			msg: "Invalid sort by query",
		});
	}

	if (!order) {
		order = "DESC";
	}

	return db
		.query(
			`
        SELECT * FROM topics
        WHERE slug = $1;`,
			[topic]
		)
		.then((res) => {
			if (res.rowCount === 0 && topic) {
				return Promise.reject({
					status: 404,
					msg: "Topic does not exist",
				});
			}

			let query = `
        SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.article_id) AS INT) comment_count
        FROM articles a 
        LEFT JOIN comments c 
        ON a.article_id = c.article_id`;
			if (topic && !sort_by) {
				query += `  WHERE a.topic = $1
                        GROUP BY a.article_id
                        ORDER BY a.created_at ${validOrders[order]};`;
				return db.query(query, [topic]);
			}

			if (topic && sort_by) {
				query += `  WHERE a.topic = $1
                        GROUP BY a.article_id
                        ORDER BY ${validSortBys[sort_by]} ${validOrders[order]};`;
				return db.query(query, [topic]);
			}

			if (sort_by) {
				query += `
                GROUP BY a.article_id
                ORDER BY ${validSortBys[sort_by]} ${validOrders[order]};`;
				return db.query(query);
			}

			query += ` GROUP BY a.article_id
                   ORDER BY a.created_at ${validOrders[order]};`;

			return db.query(query);
		})
		.then((res) => {
			if (res.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "There are no articles of this topic",
				});
			}
			const allArticles = res.rows;
			return allArticles;
		});
};

exports.fetchCommentsByArticleId = (article_id) => {
	return db
		.query(
			`SELECT * FROM articles
        WHERE article_id = $1`,
			[article_id]
		)
		.then((res) => {
			const article = res.rows[0];
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: "Article does not exist",
				});
			}
			const article_id = article.article_id;
			return article_id;
		})
		.then((article_id) => {
			return db
				.query(
					`SELECT * FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC;`,
					[article_id]
				)
				.then((res) => {
					const comments = res.rows;
					return comments;
				});
		});
};

exports.fetchAllUsers = () => {
	return db
		.query(
			`
    SELECT username, name, avatar_url
    FROM users;
    `
		)
		.then((res) => {
			const users = res.rows;
			return users;
		});
};
