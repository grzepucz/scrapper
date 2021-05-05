const express = require('express');
const process = require('process');

const { env } = process;
const server = express();
const applyRoutes = require('./middleware/router');

const CONNECTION_EVENT = 'connection';
const KEEP_ALIVE_TIMEOUT = 60000 * 15;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

applyRoutes(server);

server.listen(env.PORT || 3000, () => {
    console.log(`Server ${env.APP_NAME} run on port: ${env.PORT || 3000}`);
}).on(CONNECTION_EVENT, (socket) => {
    socket.setTimeout(KEEP_ALIVE_TIMEOUT);
});

module.exports = server;
