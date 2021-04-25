const { MapReduceJob } = require('@application');

const METHOD_GET = 'get';

module.exports = [
    {
        method: METHOD_GET,
        path: '/memes-categories',
        handler: (req, res) => {
            new MapReduceJob().run('jbzd', 'MemesInCategory').then((payload) => res.status(200).send(payload));
        },
    },
    {
        method: METHOD_GET,
        path: '/football-comments',
        handler: (req, res) => {
            new MapReduceJob().run('meczyki', 'MostCommentedNews').then((payload) => res.status(200).send(payload));
        },
    },
];
