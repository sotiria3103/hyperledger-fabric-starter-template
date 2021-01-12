const path = require("path");

const { buildCAClient, registerAndEnrollUser, enrollAdmin, } = require("../../test-application/javascript/CAUtil");
const { buildCCPOrg1, buildWallet, } = require("../../test-application/javascript/AppUtil");
const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

const channelName = "mychannel";
const chaincodeName = "trapezePolicy";
const walletPath = path.join(__dirname, "wallet");

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

exports.enroll = async (req, res) => {
    // Extract the User ID to be created for the Ledger Initialization and the Organization
    const org1UserId = req.body.userID;
    const mspOrg1 = req.body.organization;

    console.log(
        "User: " +
        " " +
        org1UserId +
        " is about to be enrolled in the HyperLedger network " +
        " " +
        mspOrg1
    );

    try {
        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(
            FabricCAServices,
            ccp,
            "ca.org1.example.com"
        );

        const wallet = await buildWallet(Wallets, walletPath);

        await registerAndEnrollUser(
            caClient,
            wallet,
            mspOrg1,
            org1UserId,
            "org1.department1"
        );

        res.status(200).send({
            message: `User ${org1UserId} is successfully enrolled`,
        });
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        res.status(500).send({ message: error.message });
    }
};
