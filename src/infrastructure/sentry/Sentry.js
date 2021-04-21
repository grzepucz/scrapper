const Raven = require('raven');
const { env } = require('process');

const initSentry = () => new Promise((resolve) => {
  const options = {
    tracesSampleRate: 0.8,
  };

  resolve(Raven.config(env.SENTRY_DSN, options).install());
}).then(() => {
  console.log('Sentry set up.');
});

module.exports = initSentry;
