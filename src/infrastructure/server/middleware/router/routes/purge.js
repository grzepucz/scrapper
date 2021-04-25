const { PurgerJob } = require('@application');

module.exports = [
    {
        method: 'get',
        path: '/',
        handler: (req, res) => new PurgerJob().run()
            .then((payload) => res.status(200).send(payload))
            .catch((error) => res.status(500).send(error)),
    },
];
