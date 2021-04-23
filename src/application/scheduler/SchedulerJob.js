const nodeSchedule = require('node-schedule');
const Raven = require('raven');
const { env } = require('process');
const SurferJob = require('../surfer/SurferJob');
const PurgerJob = require('../purger/PurgerJob');

const DEFAULT_SCHEDULE = '*/30 */2 * * *';

const SurferJobConfig = {
    name: 'Surfer',
    ApplicationJob: SurferJob,
    schedule: env.SURFER_SCHEDULE || DEFAULT_SCHEDULE,
    callback: () => console.log(`Surfer scheduled: ${new Date().toJSON()}`),
    method: 'runWithPagination',
    options: {
        limit: 4,
    },
};

const PurgerJobConfig = {
    name: 'Purger',
    ApplicationJob: PurgerJob,
    schedule: env.PURGER_SCHEDULE || DEFAULT_SCHEDULE,
    callback: () => console.log(`PurgerJob scheduled: ${new Date().toJSON()}`),
    method: 'run',
    options: {},
};

const AVAILABLE_JOBS = [SurferJobConfig, PurgerJobConfig];

class SchedulerJob {
    constructor() {
        this.init();
    }

    init() {
        AVAILABLE_JOBS.forEach((config) => {
            const {
                method, name, ApplicationJob, schedule, callback, options,
            } = config;

            nodeSchedule.scheduleJob(name, schedule, () => {
                const job = new ApplicationJob();
                job[method](options)
                    .then((data) => this.runCallback(data, callback) && data)
                    .catch((error) => Raven.captureException(error));
            });

            console.log(`Scheduled ${name}: ${schedule}`);
        });
    }

    runCallback(data, callback) {
        if (callback && typeof callback === 'function') {
            callback(data);
        }
    }

    getJobs() {
        return nodeSchedule.scheduledJobs;
    }
}

module.exports = new SchedulerJob();
