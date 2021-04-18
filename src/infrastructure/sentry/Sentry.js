const Raven = require('raven');
const { env } = require('process');

const initSentry = () => new Promise((resolve) => {
  resolve(Raven.config(env.SENTRY_DSN, {
    tracesSampleRate: 0.8,
  }).install());
}).then(() => {
  console.log('Sentry set up.');
});

module.exports = initSentry;
