const nodeSchedule = require('node-schedule');
const Raven = require('raven');
const { env } = require('process');
const SurferJob = require('../surfer/SurferJob');

const DEFAULT_SCHEDULE = '*/5 */12 * * *';

const SurferJobConfig = {
    name: 'Surfer',
    ApplicationJob: SurferJob,
    schedule: env.SURFER_SCHEDULE || DEFAULT_SCHEDULE,
    callback: () => console.log(`Surfer scheduled: ${new Date().toJSON()}`),
};

const AVAILABLE_JOBS = [SurferJobConfig];

class SchedulerJob {
    constructor() {
        this.init();
    }

    init() {
        AVAILABLE_JOBS.forEach((config) => {
            const {
                name, ApplicationJob, schedule, callback,
            } = config;

            nodeSchedule.scheduleJob(name, schedule, () => {
                const job = new ApplicationJob();
                job.run()
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
