# Northcoders News API

HOSTED PROJECT

The hosted version of this project can be found at: https://api-news-tenc.onrender.com

Please add any endpoint from the endpoints.json file to see the results.
E.g. https://api-news-tenc.onrender.com/api/articles

SUMMARY

This project is an API for a news application. It utilises express with postgresql and is set up as an MVC environment, built with TDD with the help of NodeJS and Jest.

LOCAL SET UP

To clone the repo: git clone https://github.com/Arron-B/API-nc-news.git

Minimum versions:

- Node.js v18.18.0
- PSQL v14.9

Install dependencies:

- npm install

To access developoment and test databases, please create two files in the root directory with the following details:

File 1 name: .env.development
File 1 content: PGDATABASE=nc_news

File 2 name: .env.test
File 2 content: PGDATABASE=nc_news_test

Running the seed or running tests should now access the correct data for each.

- npm run seed
- npm test
