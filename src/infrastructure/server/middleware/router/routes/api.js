const SurferJob = require('@application/surfer/SurferJob');

module.exports = [
    {
        method: 'get',
        path: '/run',
        handler: (req, res) => {
            new SurferJob().run()
                .then((payload) => {
                    res.status(200).send(payload);
                });
        },
    },
];
