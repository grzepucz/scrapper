const SurferJob = require('@application/surfer/SurferJob');

module.exports = [
    {
        method: 'get',
        path: '/run',
        handler: (req, res) => {
            const { limit } = req.query;
            const job = new SurferJob();

            job.runWithPagination({ limit })
                .then((payload) => res.status(200).send(payload))
                .catch((error) => res.status(500).send(error));
        },
    },
];
