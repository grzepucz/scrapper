require('module-alias/register');
require('dotenv').config();

require('@server/server');
const setUpSentry = require('@sentry');
const { SchedulerJob } = require('@application');

setUpSentry();
new SchedulerJob().init();
