require('module-alias/register');
require('dotenv').config();
require('@server/server');
require('@sentry')();
const Scheduler = require('@application/scheduler/SchedulerJob');

const scheduler = new Scheduler();