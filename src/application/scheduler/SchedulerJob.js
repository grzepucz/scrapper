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
    method: 'runWithPagination',
    options: {
        limit: 4,
    },
};

const PurgerJobConfig = {
    name: 'Purger',
    ApplicationJob: PurgerJob,
    schedule: env.PURGER_SCHEDULE || DEFAULT_SCHEDULE,
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

            const worker = nodeSchedule.scheduleJob(name, schedule, () => {
                const job = new ApplicationJob();
                job[method](options)
                    .then((data) => this.runCallback(data, callback) && data)
                    .catch((error) => Raven.captureException(error));

                console.log(`Finished ${name} | ${worker.triggeredJobs()}`);
            });

            this.initSchedulerEvents(worker, config);
        });
    }

    initSchedulerEvents(job, config) {
        const { name, schedule } = config;
        job.on('run', () => {
            console.log(`${name} juz run...`);
        });

        job.on('scheduled', () => {
            console.log(`Scheduled ${name}: ${schedule}`);
        });
    }

    runCallback(data, callback) {
        if (callback && typeof callback === 'function') {
            callback(data);
        }

        return true;
    }

    getJobs() {
        return nodeSchedule.scheduledJobs;
    }
}

module.exports = new SchedulerJob();
