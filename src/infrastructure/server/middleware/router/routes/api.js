const { SurferJob } = require('@application');

const METHOD_GET = 'get';

module.exports = [
    {
        method: METHOD_GET,
        path: '/run',
        handler: (req, res) => new SurferJob().runWithPagination(req.query)
            .then((payload) => res.status(200).send({
                status: 200,
                message: payload,
            }))
            .then(() => res.end())
            .catch((error) => res.status(500).send(error)),
    },
];
