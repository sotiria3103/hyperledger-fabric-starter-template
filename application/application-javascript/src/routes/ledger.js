const express = require("express");
const path = require("path");

const { buildCAClient, registerAndEnrollUser, enrollAdmin, } = require("../../../../test-application/javascript/CAUtil");
const { buildCCPOrg1, buildWallet, } = require("../../../../test-application/javascript/AppUtil");
const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

const app = express();

const channelName = "mychannel";
const chaincodeName = "trapeze";
const walletPath = path.join(__dirname, "wallet");

class LedgerRoutes {
    get routes() {
        app.post('/init', async (request, response, next) => {
            const { userID: org1UserId, organization: mspOrg1 } = request.body;

            console.log(`Ledger and Admin and user: ${org1UserId} are about to be initialized for organization ${mspOrg1}`);
            // return response.status(200).json({ path: path.join(__dirname, "..", "..", "wallet") })
            try {
                const ccp = buildCCPOrg1();
                const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");

                const wallet = await buildWallet(Wallets, walletPath);

                await enrollAdmin(caClient, wallet, mspOrg1);

                await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");

                // return response.status(200).json({ wallet, identity: org1UserId, discovery: { enabled: true, asLocalhost: true } })

                const gateway = new Gateway();
                try {
                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
                    });

                    const network = await gateway.getNetwork(channelName);

                    const contract = network.getContract(chaincodeName);

                    console.log("\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger");

                    await contract.submitTransaction("InitLedger");
                    console.log("*** Result: committed");

                    console.log("\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger");

                    let result = await contract.evaluateTransaction("GetAllPolicies");
                    // console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                    response.status(200).send({
                        message: `Successful Hyperledger, Admin and Organization set up`,
                        ledger: JSON.parse(result),
                    });
                } catch (error) {
                    response.status(400).send({
                        message: `Failed Successful Hyperledger, Admin and Organization set up`,
                        // ledger: JSON.parse(result),
                        error
                    });
                }
                finally {
                    gateway.disconnect();
                }
            } catch (error) {
                console.error(`******** FAILED to run the application: ${error}`);
                res.status(500).send({ message: error.message });
            }

            response.status(200).json({ message: `Ledger and Admin and user: ${org1UserId} are about to be initialized for organisation ${mspOrg1}` })
        });

        app.use('**', async (request, response, next) => {
            response.status(404).json({ message: "Not found!" })
        });

        return app;
    }
}

module.exports = LedgerRoutes;