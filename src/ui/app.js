require('module-alias/register');
require('dotenv').config();
require('@server/server');
require('@sentry')();
const Scheduler = require('@application/scheduler/SchedulerJob');

const scheduler = new Scheduler();
// const HadoopClient = require('@infrastructure/storage/hadoop/HadoopClient');
// const ArticleRepository = require('@infrastructure/storage/mongo/ArticleRepository');
//
// const hadoopClient = new HadoopClient();
// const repository = new ArticleRepository();
//
