# Northcoders News API

To access developoment and test databases, please create two files in the root directory with the following details:

File 1 name: .env.development
File 1 content: PGDATABASE=nc_news

File 2 name: .env.test
File 2 content: PGDATABASE=nc_news_test

Running the seed or running tests should now access the correct data for each.
