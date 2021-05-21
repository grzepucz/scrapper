const { MapReduceJob, PrintResultJob } = require('@application');

const METHOD_GET = 'get';

module.exports = [
    {
        method: METHOD_GET,
        path: '/memes-categories',
        handler: (req, res) => {
            const params = {
                domain: 'jbzd',
                action: 'MemesInCategory',
            };

            new MapReduceJob().run(params)
                .then((fileHash) => res.redirect(`/mr/result/${fileHash}`))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/football-comments',
        handler: (req, res) => {
            const params = {
                domain: 'meczyki',
                action: 'MostCommentedNews',
            };

            new MapReduceJob().run(params)
                .then((fileHash) => res.redirect(`/mr/result/${fileHash}`))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/ufc-leaders',
        handler: (req, res) => {
            const params = {
                domain: 'ufc',
                action: 'UFCLeaders',
            };

            new MapReduceJob().run(params)
                .then((fileHash) => res.redirect(`/mr/result/${fileHash}`))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/result/:fileHash',
        handler: (req, res) => {
            const { fileHash } = req.params;
            new PrintResultJob().run({ fileHash })
                .then((payload) => res.render('result', { payload }))
                .catch((error) => res.status(500).send(error));
        },
    },
];
