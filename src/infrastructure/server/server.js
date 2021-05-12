const express = require('express');
const process = require('process');

const { env } = process;
const server = express();
const applyRoutes = require('./middleware/router');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

applyRoutes(server);

server.listen(env.PORT || 3000, () => {
    console.log(`Server ${env.APP_NAME} run on port: ${env.PORT || 3000}`);
});

module.exports = server;
