const SurferJob = require('@application/surfer/SurferJob');
const MapReduceFactory = require('@application/mapReduce/factory/MapReduceFactory');

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
        path: '/memes-categories',
        handler: (req, res) => {
            // const { limit, start } = req.query;
            // return new SurferJob().runWithPagination({ start, limit })
            //     .then((payload) => res.status(200).send({
            //         status: 200,
            //         message: payload,
            //     }))
            //     .catch((error) => res.status(500).send(error));
            MapReduceFactory.getFactory('foo').run('jbzd')
            return res.status(200).send(true);
        },
    },
];
