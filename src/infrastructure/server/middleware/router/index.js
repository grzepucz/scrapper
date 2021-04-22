const express = require('express');
const routes = require('./routes');

const applyRoutes = (application) => {
    Object.entries(routes).forEach(([key, handlers]) => {
        const router = express.Router();

        handlers.forEach((route) => {
            const { method, path, handler } = route;
            router[method](`${path}`, handler);
        });

        application.use(`/${key}`, router);
    });
};

module.exports = applyRoutes;
