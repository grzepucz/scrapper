const WebClient = require('./client/WebClient');
const ArticleParser = require('./parser/model/article/ArticleParser');
const NewsParser = require('./parser/model/news/NewsParser');
const {
    ClientProvider, MAP_REDUCE_OPERATION, READ_OPERATION, WRITE_OPERATION,
} = require('./storage/hadoop/ClientProvider');
const ArticleRepository = require('./storage/mongo/repository/ArticleRepository');
const NewsRepository = require('./storage/mongo/repository/NewsRepository');

// const MapReduceHandler = require('./storage/hadoop/handler/MapReduceHandler');
// const ReadFileHandler = require('./storage/hadoop/handler/ReadFileHandler');
// const WriteFileHandler = require('./storage/hadoop/handler/WriteFileHandler');

module.exports = {
    WebClient,
    ArticleRepository,
    ArticleParser,
    NewsParser,
    NewsRepository,
    ClientProvider,
    // MapReduceHandler,
    // ReadFileHandler,
    // WriteFileHandler,
    MAP_REDUCE_OPERATION,
    READ_OPERATION,
    WRITE_OPERATION,
};
