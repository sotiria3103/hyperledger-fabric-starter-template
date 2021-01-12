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

exports.initLedger = async (request, response, next) => {
    const org1UserId = request.body.userID;
    const mspOrg1 = request.body.organization;

    console.log(`Ledger and Admin and user: ${org1UserId} are about to be initialized for organization ${mspOrg1}`);
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
}

exports.createPolicy = async (req, res) => {
    //
    const org1UserId = req.body.userID;

    const id = req.body.id;
    const hasDataSubject = req.body.hasDataSubject;
    const hasPersonalDataCategory = req.body.hasPersonalDataCategory;
    const hasProcessing = req.body.hasProcessing;
    const hasPurpose = req.body.hasPurpose;
    const hasRecipient = req.body.hasRecipient;
    const hasLocation = req.body.hasStorage.hasLocation;
    const hasDuration = req.body.hasStorage.hasDuration;
    const durationInDays = req.body.hasStorage.durationInDays;

    try {
        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(
            FabricCAServices,
            ccp,
            "ca.org1.example.com"
        );

        const wallet = await buildWallet(Wallets, walletPath);
        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            console.log('\n--> Submit Transaction: CreatePolicy, creates new asset with id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration and durationInDays arguments');

            let result = await contract.submitTransaction(
                "CreatePolicy",
                id,
                hasDataSubject,
                hasPersonalDataCategory,
                hasProcessing,
                hasPurpose,
                hasRecipient,
                hasLocation,
                hasDuration,
                durationInDays
            );
            console.log(`*** Result committed: ${prettyJSONString(result.toString())}`);

            console.log("\n--> Evaluate Transaction: ReadPolicy, function returns an asset with a given assetID");
            result = await contract.evaluateTransaction("ReadPolicy", id);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            res.status(200).send({
                message: "Policy is created",
                policy: JSON.parse(result.toString()),
            });
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        res.status(500).send({ message: error.message });
    }
}

exports.updatePolicy = async (req, res) => {
    const org1UserId = req.body.userID;

    const id = req.body.id;
    const hasDataSubject = req.body.hasDataSubject;
    const hasPersonalDataCategory = req.body.hasPersonalDataCategory;
    const hasProcessing = req.body.hasProcessing;
    const hasPurpose = req.body.hasPurpose;
    const hasRecipient = req.body.hasRecipient;
    const hasLocation = req.body.hasStorage.hasLocation;
    const hasDuration = req.body.hasStorage.hasDuration;
    const durationInDays = req.body.hasStorage.durationInDays;

    try {
        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(
            FabricCAServices,
            ccp,
            "ca.org1.example.com"
        );

        const wallet = await buildWallet(Wallets, walletPath);
        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await gateway.getNetwork(channelName);

            const contract = network.getContract(chaincodeName);

            console.log('\n--> Submit Transaction: UpdatePolicy asset1, change the appraisedValue to 350');

            let result = await contract.submitTransaction(
                "UpdatePolicy",
                id,
                hasDataSubject,
                hasPersonalDataCategory,
                hasProcessing,
                hasPurpose,
                hasRecipient,
                hasLocation,
                hasDuration,
                durationInDays);
            console.log(`*** Result committed: ${prettyJSONString(result.toString())}`);

            console.log("\n--> Evaluate Transaction: ReadPolicy, function returns an asset with a given assetID");
            result = await contract.evaluateTransaction("ReadPolicy", id);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            res.status(200).send({
                message: "Policy is updated",
                policy: JSON.parse(result.toString()),
            });
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        res.status(500).send({ message: error.message });
    }
}

exports.readPolicy = async (req, res) => {
    // Extract the User ID for HyperLedger Fabric Interaction
    const org1UserId = req.body.userID;
    const policyID = req.body.policyID;

    try {
        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(
            FabricCAServices,
            ccp,
            "ca.org1.example.com"
        );

        const wallet = await buildWallet(Wallets, walletPath);
        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            console.log('\n--> Evaluate Transaction: ReadPolicy, function returns policy with policyID');
            let result = await contract.evaluateTransaction('ReadPolicy',policyID);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            res.status(200).send({ ledger: JSON.parse(result) });
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        res.status(500).send({ message: error.message });
    }
}

exports.readPolicyLedger = async (req, res) => {
    // Extract the User ID for HyperLedger Fabric Interaction
    const org1UserId = req.body.userID;

    try {
        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(
            FabricCAServices,
            ccp,
            "ca.org1.example.com"
        );

        const wallet = await buildWallet(Wallets, walletPath);
        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            console.log('\n--> Evaluate Transaction: GetAllPolicies, function returns all the current assets on the ledger');
            let result = await contract.evaluateTransaction('GetAllPolicies');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            res.status(200).send({ ledger: JSON.parse(result) });
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        res.status(500).send({ message: error.message });
    }
}
