require('module-alias/register');
require('dotenv').config();

require('@server/server');
require('@sentry')();
require('@application/scheduler/SchedulerJob');
