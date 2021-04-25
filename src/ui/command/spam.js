const fetch = require('node-fetch');
const process = require('process');

const surferEndpoint = 'http://localhost:8080/api/run';
const purgerEndpoint = 'http://localhost:8080/purge';

const BEFORE_EXIT_EVENT = 'beforeExit';

/**
 * Input parameter should have --name=value format
 * available input params:
 * --step
 * --startPage
 * --endPage
 * --interval
 * --endpoint
 * @returns {{}}
 */
const getInputParameters = () => {
    const inputParameters = {};
    const { argv } = process;

    if (argv.length > 2) {
        argv.slice(2, argv.length)
            .filter((arg) => arg.match(/^--[a-zA-Z0-9]*=[a-zA-Z0-9]*$/))
            .forEach((arg) => {
                const [key, value] = arg.split('=');
                inputParameters[key.slice(2, key.length)] = value;
            });
    }

    return inputParameters;
};

const cleanAfterward = () => new Promise((resolve) => fetch(purgerEndpoint).then((response) => {
    console.log('Cleaned.');
    resolve(response);
})).then((response) => response).then(() => {
    process.off('beforeExit', cleanAfterward);
    process.exit(0);
});

const spam = () => {
    const parameters = getInputParameters();

    const {
        step = '1',
        startPage = '1',
        endPage = '3',
        interval = '12000',
        endpoint = surferEndpoint,
    } = parameters;

    console.log('Parameters:');
    console.log(parameters);

    let current = Number.parseInt(startPage, 10);

    const spammer = setInterval(() => {
        console.log(`Current iteration: ${current}`);

        fetch(`${endpoint}?limit=${step}&start=${current}`)
            .then((data) => data.text())
            .then((data) => {
                current = Number.parseInt(current, 10) + Number.parseInt(step, 10);
                console.log(data);

                if (current >= endPage) {
                    console.log('Interval cleared. Finishing');
                    clearInterval(spammer);
                }
            });
    }, Number.parseInt(interval, 10));
};

process.on('beforeExit', cleanAfterward);

spam();
