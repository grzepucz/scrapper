require('module-alias/register');
require('dotenv').config();
require('@server/server');
const HadoopClient = require('@infrastructure/storage/hadoop/HadoopClient');
const ArticleRepository = require('@infrastructure/storage/mongo/ArticleRepository');

const hadoopClient = new HadoopClient();
const repository = new ArticleRepository();

repository.saveOne({ name: 'TEST ALE UDANY!' });
