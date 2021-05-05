const { MapReduceJob, PrintResultJob } = require('@application');

const METHOD_GET = 'get';

module.exports = [
    {
        method: METHOD_GET,
        path: '/memes-categories',
        handler: (req, res) => {
            const { domain, action } = req.query;
            new MapReduceJob().run({ domain, action })
                .then((fileHash) => res.redirect(`/mr/result/${fileHash}?domain=${domain}&action=${action}`))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/football-comments',
        handler: (req, res) => {
            const { domain, action } = req.query;
            new MapReduceJob().run({ domain, action })
                .then((fileHash) => res.redirect(`/mr/result/${fileHash}?domain=${domain}&action=${action}`))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/result/:fileHash',
        handler: (req, res) => {
            const { fileHash } = req.params;
            new PrintResultJob().run({ fileHash })
                .then((payload) => res.status(200).send(payload))
                .catch((error) => res.status(500).send(error));
        },
    },
];
