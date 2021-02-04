const express = require("express");

const { initLedger, createPolicy, updatePolicy, readPolicy, deletePolicy, transferPolicy, readPolicyLedger } = require("../controllers/LedgerController");

const app = express();

class LedgerRoutes {
    get routes() {
        app.post('/init', initLedger);
        // Create a new Policy
        app.post("/createPolicy", createPolicy);
        //
        // Update an existing Policy
        app.post("/updatePolicy", updatePolicy);
        //
        // Read a Policy
        app.post("/readPolicy", readPolicy);
        //
        // delete a Policy
        app.post("/deletePolicy", deletePolicy);
        //
        // transfer a Policy
        app.post("/transferPolicy", transferPolicy);
        //
        // Get all the ledger information
        app.post("/readPolicyLedger", readPolicyLedger);

        app.use('**', async (request, response, next) => {
            response.status(404).json({ message: "Not found!" })
        });

        return app;
    }
}

module.exports = LedgerRoutes;