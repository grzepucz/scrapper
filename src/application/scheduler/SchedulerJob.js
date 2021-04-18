const nodeSchedule = require('node-schedule');
const Raven = require('raven');
const SurferJob = require('../surfer/SurferJob');

const SurferJobConfig = {
  name: 'Surfer',
  ApplicationJob: SurferJob,
  schedule: '* * * * *',
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
          .then(() => callback && callback())
          .catch((error) => Raven.captureException(error));
      });
    });
  }

  getJobs() {
    return nodeSchedule.scheduledJobs;
  }
}

module.exports = Scheduler;
