const express = require("express");
const config = require("./src/utils/config");
const { dbConnection } = require("./src/utils/connection")
const { shutDown } = require("./src/utils/helpers")
const MiddlewaresBase = require("./src/middlewares")

const app = express();
let server;

app.use(MiddlewaresBase.configuration)

dbConnection()
    .then(() => {
        console.log("Connected to database");
        server = app.listen(config.port, () => { console.log(`API server listening on ${config.host}:${config.port}, in ${config.env} mode`); });
    })
    .catch(error => {
        server = app.listen(config.port, () => { console.log("Failed to connect with database. Shutting down now"); });
        shutDown(server);
    });