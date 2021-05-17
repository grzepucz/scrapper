const express = require('express');
const process = require('process');
const path = require('path');

const { env } = process;
const server = express();
const applyRoutes = require('./middleware/router');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'twig');

applyRoutes(server);

server.listen(env.PORT || 3000, () => {
    console.log(`Server ${env.APP_NAME} run on port: ${env.PORT || 3000}`);
});

module.exports = server;
