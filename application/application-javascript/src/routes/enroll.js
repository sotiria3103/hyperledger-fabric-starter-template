const express = require("express");

const app = express();

class EnrollRoutes {
    get routes() {
        app.use('/', async (request, response, next) => {
            response.status(200).json({ message: "enroll!" })
        });

        return app;
    }
}

module.exports = EnrollRoutes;