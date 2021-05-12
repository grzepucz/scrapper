const Raven = require('raven');
const { env } = require('process');

/**
 *
 */
const initSentry = () => {
    if (env.SENTRY_ON === 'true') {
        const options = {
            tracesSampleRate: 0.8,
        };

        Raven.config(env.SENTRY_DSN, options).install();
        console.log('Set up Sentry.');
    }
};

module.exports = initSentry;
