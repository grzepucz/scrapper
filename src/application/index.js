const MapReduceJob = require('./mapReduce/MapReduceJob');
const PrintResultJob = require('./mapReduce/PrintResultJob');
const PurgerJob = require('./purger/PurgerJob');
const SchedulerJob = require('./scheduler/SchedulerJob');
const ScrapperJob = require('./scrapper/ScrapperJob');
const SurferJob = require('./surfer/SurferJob');

module.exports = {
    MapReduceJob,
    PrintResultJob,
    PurgerJob,
    SchedulerJob,
    ScrapperJob,
    SurferJob,
};
