const fs = require("fs");
const path = require("path")
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Helmet helps to secure the application by setting various HTTP headers
const morgan = require("morgan");
const BaseRoutes = require("../routes");
const Logger = require("../utils/logger")

class MiddlewaresBase {
    static get configuration() {
        const app = express();

        app.use(express.json());
        app.use(cors());
        app.use(helmet());
        app.use(morgan("dev", { stream: new Logger().accessStreamer }))

        // Routes
        app.use(new BaseRoutes().routes);
        // Error handler
        app.use((error, request, response, next) => {
            return response.status(400).json(error);
        });

        return app;
    }
}

module.exports = MiddlewaresBase;