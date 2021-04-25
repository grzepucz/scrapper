const SurferJob = require('@application/surfer/SurferJob');

const METHOD_GET = 'get';

module.exports = [
    {
        method: METHOD_GET,
        path: '/run',
        handler: (req, res) => {
            const { limit, start } = req.query;
            return new SurferJob().runWithPagination({ start, limit })
                .then((payload) => res.status(200).send({
                    status: 200,
                    message: payload,
                }))
                .catch((error) => res.status(500).send(error));
        },
    },
    {
        method: METHOD_GET,
        path: '/dashboard',
        handler: (req, res) => {
            // const { limit, start } = req.query;
            // return new SurferJob().runWithPagination({ start, limit })
            //     .then((payload) => res.status(200).send({
            //         status: 200,
            //         message: payload,
            //     }))
            //     .catch((error) => res.status(500).send(error));
            return res.status(200).send(true);
        },
    },
];
