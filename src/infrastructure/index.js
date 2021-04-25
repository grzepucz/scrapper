const WebClient = require('./client/WebClient');
const ArticleParser = require('./parser/model/article/ArticleParser');
const NewsParser = require('./parser/model/news/NewsParser');
const ClientProvider = require('./storage/hadoop/ClientProvider');
const ArticleRepository = require('./storage/mongo/repository/ArticleRepository');
const NewsRepository = require('./storage/mongo/repository/NewsRepository');

const {
    MapReduceHandler,
    MEMES_IN_CATEGORY_MR,
    MOST_COMMENTED_NEWS_MR,
    REDUCE_OUTPUT,
} = require('./storage/hadoop/handler/MapReduceHandler');
const ReadFileHandler = require('./storage/hadoop/handler/ReadFileHandler');
const WriteFileHandler = require('./storage/hadoop/handler/WriteFileHandler');

module.exports = {
    WebClient,
    ArticleRepository,
    ArticleParser,
    NewsParser,
    NewsRepository,
    ClientProvider,
    MapReduceHandler,
    ReadFileHandler,
    WriteFileHandler,
    MEMES_IN_CATEGORY_MR,
    MOST_COMMENTED_NEWS_MR,
    REDUCE_OUTPUT,
};
