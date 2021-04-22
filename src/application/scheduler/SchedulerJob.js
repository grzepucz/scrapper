const nodeSchedule = require('node-schedule');
const Raven = require('raven');
const SurferJob = require('../surfer/SurferJob');

const SurferJobConfig = {
    name: 'Surfer',
    ApplicationJob: SurferJob,
    schedule: '*/30 * * * *',
    callback: () => console.log(`Surfer scheduled: ${new Date().toJSON()}`),
};

const AVAILABLE_JOBS = [SurferJobConfig];

class Scheduler {
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

            console.log(`Scheduled: ${name}.`);
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

module.exports = Scheduler;
