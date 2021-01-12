const express = require("express");
const { enroll } = require("../controllers/EnrollController");
const app = express();

class EnrollRoutes {
    get routes() {
        app.use('/', enroll);

        return app;
    }
}

module.exports = EnrollRoutes;