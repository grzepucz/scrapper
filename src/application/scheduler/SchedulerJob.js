const nodeSchedule = require('node-schedule');
const Raven = require('raven');
const { env } = require('process');
const SurferJob = require('../surfer/SurferJob');
const PurgerJob = require('../purger/PurgerJob');

const DEFAULT_SCHEDULE = '*/30 */2 * * *';

const SurferJobConfigs = [
    {
        name: 'Surfer 1-3',
        ApplicationJob: SurferJob,
        schedule: '1 * * * *',
        method: 'runWithPagination',
        options: {
            start: 1,
            limit: 3,
        },
    },
    {
        name: 'Surfer 4-6',
        ApplicationJob: SurferJob,
        schedule: '6 * * * *',
        method: 'runWithPagination',
        options: {
            start: 4,
            limit: 6,
        },
    },
    {
        name: 'Surfer 7-9',
        ApplicationJob: SurferJob,
        schedule: '11 * * * *',
        method: 'runWithPagination',
        options: {
            start: 7,
            limit: 9,
        },
    },
];

const PurgerJobConfig = {
    name: 'Purger',
    ApplicationJob: PurgerJob,
    schedule: env.PURGER_SCHEDULE || DEFAULT_SCHEDULE,
    method: 'run',
    options: {},
};

const AVAILABLE_JOBS = [...SurferJobConfigs, PurgerJobConfig];
// const AVAILABLE_JOBS = [PurgerJobConfig];

class SchedulerJob {
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

module.exports = SchedulerJob;
