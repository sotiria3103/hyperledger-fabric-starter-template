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

            try {
                const ccp = buildCCPOrg1();
                const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");

                const wallet = await buildWallet(Wallets, walletPath);

                await enrollAdmin(caClient, wallet, mspOrg1);

                await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");

                const gateway = new Gateway();
                try {
                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
                    });

                    const network = await gateway.getNetwork(channelName);
                    const contract = network.getContract(chaincodeName);

                    console.log("\n--> Submit Transaction: InitLedger, function creates the initial set of policies on the ledger");
                    await contract.submitTransaction("InitLedger");
                    console.log("*** Result: committed");

                    return response.status(201).json({ message: `Ledger, admin and user: ${org1UserId} initialized for organisation ${mspOrg1}` });

                    // console.log("\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger");

                    // let result = await contract.evaluateTransaction("GetAllPolicies");

                    // return response.status(200).json({
                    //     message: `Successful Hyperledger, Admin and Organization set up`,
                    //     ledger: JSON.parse(result),
                    // });
                } catch (error) {
                    return response.status(400).json({
                        message: `Failed to set up the ledger`,
                        error
                    });
                }
                finally {
                    gateway.disconnect();
                }
            } catch (error) {
                console.error(`******** FAILED to run the application: ${error}`);
                return response.status(500).json({ message: error.message });
            }
        });

        app.use('**', async (request, response, next) => {
            return response.status(404).json({ message: "Not found!" })
        });

        return app;
    }
}

module.exports = LedgerRoutes;