const SurferJob = require('@application/surfer/SurferJob');

module.exports = [
    {
        method: 'get',
        path: '/run',
        handler: (req, res) => {
            const { limit } = req.query;
            const job = new SurferJob();
            const jobData = limit && limit > 0 ? job.runWithPagination(limit) : job.run();

            jobData.then((payload) => {
                res.status(200).send(payload);
            });
        },
    },
];
