const express = require("express");
const EnrollRoutes = require("../routes/enroll");
const LedgerRoutes = require("../routes/ledger");
const app = express();

class BaseRoutes {
    get routes() {
        app.use("/enroll", new EnrollRoutes().routes);
        app.use("/ledger", new LedgerRoutes().routes);

        app.use('/', async (request, response, next) => {
            response.status(200).json({ message: "Hello, World!" })
        });


        return app;
    }
}

module.exports = BaseRoutes;