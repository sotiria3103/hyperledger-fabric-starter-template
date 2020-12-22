const express = require("express");

const app = express();

class BaseRoutes {
    get routes() {
        app.use('/', async (request, response, next) => {
            response.status(200).json({ message: "Hello, World!" })
        });

        return app;
    }
}

module.exports = BaseRoutes;