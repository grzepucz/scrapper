const WebClient = require('./client/WebClient');
const ArticleParser = require('./parser/model/article/ArticleParser');
const NewsParser = require('./parser/model/news/NewsParser');
const UfcParser = require('./parser/model/ufc/UfcParser');
const {
    ClientProvider, MAP_REDUCE_OPERATION, READ_OPERATION, WRITE_OPERATION,
} = require('./storage/hadoop/ClientProvider');
const ArticleRepository = require('./storage/mongo/repository/ArticleRepository');
const NewsRepository = require('./storage/mongo/repository/NewsRepository');
const UfcRepository = require('./storage/mongo/repository/UfcRepository');

module.exports = {
    WebClient,
    ArticleRepository,
    ArticleParser,
    NewsParser,
    NewsRepository,
    UfcParser,
    UfcRepository,
    ClientProvider,
    MAP_REDUCE_OPERATION,
    READ_OPERATION,
    WRITE_OPERATION,
};
