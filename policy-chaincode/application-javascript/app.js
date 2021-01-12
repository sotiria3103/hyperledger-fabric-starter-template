
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


// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const { Gateway, Wallets } = require('fabric-network');
// const FabricCAServices = require('fabric-ca-client');
// const path = require('path');
// const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./test-application/javascript/CAUtil.js');
// const { buildCCPOrg1, buildWallet } = require('./test-application/javascript/AppUtil.js');

// const channelName = 'mychannel';
// const chaincodeName = 'trapezePolicy';
// const mspOrg1 = 'Org1MSP';
// const walletPath = path.join(__dirname, 'wallet');
// const org1UserId = 'appUser';

// const express = require("express");
// const bodyParser = require("body-parser");
// const router = express.Router();
// const app = express();
// let contract;

// //Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// router.get('/initPolicies', async (req, res) => {
// 	let result = await initPolicies();
// 	res.send(result);
// });

// router.get('/getAllPolicies', async (req, res) => {
// 	let result = await getAllPolicies();
// 	res.send(result);
// });

// router.post('/readPolicy', async (req, res) => {
// 	console.log(req.body);
// 	let result = await readPolicy(req.body.id);
// 	res.send(result);
// });

// router.post('/createPolicy', async (req, res) => {
// 	console.log(req.body);
// 	let result = await createPolicy(
// 		req.body.id,
// 		req.body.hasDataSubject,
// 		req.body.hasPersonalDataCategory,
// 		req.body.hasProcessing,
// 		req.body.hasPurpose,
// 		req.body.hasRecipient,
// 		req.body.hasStorage.hasLocation,
// 		req.body.hasStorage.hasDuration,
// 		req.body.hasStorage.durationInDays);
// 	res.send(result);
// });

// router.post('/updatePolicy', async (req, res) => {
// 	console.log(req.body);
// 	let result = await updatePolicy(
// 		req.body.id,
// 		req.body.hasDataSubject,
// 		req.body.hasPersonalDataCategory,
// 		req.body.hasProcessing,
// 		req.body.hasPurpose,
// 		req.body.hasRecipient,
// 		req.body.hasStorage.hasLocation,
// 		req.body.hasStorage.hasDuration,
// 		req.body.hasStorage.durationInDays);
// 	res.send(result);
// });

// router.post('/transferPolicy', async (req, res) => {
// 	console.log(req.body);
// 	let result = await transferPolicy(
// 		req.body.id,
// 		req.body.hasDataSubject);
// 	res.send(result);
// });

// router.post('/policyExists', async (req, res) => {
// 	console.log(req.body);
// 	let result = await policyExists(req.body.id);
// 	res.send(result);
// });
// // add router in the Express app.
// app.use("/", router);

// app.listen(3000, async () => {
// 	console.log('Gator app listening on port 3000!');
// 	await init();
// });

// // pre-requisites:
// // - fabric-sample two organization my-test-network setup with two peers, ordering service,
// //   and 2 certificate authorities
// //         ===> from directory /fabric-samples/my-test-network
// //         ./network.sh up createChannel -ca
// // - Use any of the policy-chaincode chaincodes deployed on the channel "mychannel"
// //   with the chaincode name of "trapezePolicy". The following deploy command will package,
// //   install, approve, and commit the javascript chaincode, all the actions it takes
// //   to deploy a chaincode to a channel.
// //         ===> from directory /fabric-samples/my-test-network
// //         ./network.sh deployCC -ccn trapezePolicy -ccp ../policy-chaincode/chaincode-javascript/ -ccl javascript
// // - Be sure that node.js is installed
// //         ===> from directory /fabric-samples/policy-chaincode/application-javascript
// //         node -v
// // - npm installed code dependencies
// //         ===> from directory /fabric-samples/policy-chaincode/application-javascript
// //         npm install
// // - to run this test application
// //         ===> from directory /fabric-samples/policy-chaincode/application-javascript
// //         node app.js

// // NOTE: If you see  kind an error like these:
// /*
// 	2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
// 	******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

//    OR

//    Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
//    ******** FAILED to run the application: Error: Identity not found in wallet: appUser
// */
// // Delete the /fabric-samples/policy-chaincode/application-javascript/wallet directory
// // and retry this application.
// //
// // The certificate authority must have been restarted and the saved certificates for the
// // admin and application user are not valid. Deleting the wallet store will force these to be reset
// // with the new certificate authority.
// //

// /**
//  *  A test application to show basic queries operations with any of the policy-chaincode chaincodes
//  *   -- How to submit a transaction
//  *   -- How to query and check the results
//  *
//  * To see the SDK workings, try setting the logging to show on the console before running
//  *        export HFC_LOGGING='{"debug":"console"}'
//  */
// async function main() {
// 	try {
// 		// build an in memory object with the network configuration (also known as a connection profile)
// 		const ccp = buildCCPOrg1();

// 		// build an instance of the fabric ca services client based on
// 		// the information in the network configuration
// 		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

// 		// setup the wallet to hold the credentials of the application user
// 		const wallet = await buildWallet(Wallets, walletPath);

// 		// in a real application this would be done on an administrative flow, and only once
// 		await enrollAdmin(caClient, wallet, mspOrg1);

// 		// in a real application this would be done only when a new user was required to be added
// 		// and would be part of an administrative flow
// 		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

// 		// Create a new gateway instance for interacting with the fabric network.
// 		// In a real application this would be done as the backend server session is setup for
// 		// a user that has been verified.
// 		const gateway = new Gateway();

// 		try {
// 			// setup the gateway instance
// 			// The user will now be able to create connections to the fabric network and be able to
// 			// submit transactions and query. All transactions submitted by this gateway will be
// 			// signed by this user using the credentials stored in the wallet.
// 			await gateway.connect(ccp, {
// 				wallet,
// 				identity: org1UserId,
// 				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
// 			});

// 			// Build a network instance based on the channel where the smart contract is deployed
// 			const network = await gateway.getNetwork(channelName);

// 			// Get the contract from the network.
// 			const contract = network.getContract(chaincodeName);

// 			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
// 			// This type of transaction would only be run once by an application the first time it was started after it
// 			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
// 			// an "init" type function.
// 			console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
// 			await contract.submitTransaction('InitLedger');
// 			console.log('*** Result: committed');

// 			// Let's try a query type operation (function).
// 			// This will be sent to just one peer and the results will be shown.
// 			console.log('\n--> Evaluate Transaction: GetAllPolicies, function returns all the current assets on the ledger');
// 			let result = await contract.evaluateTransaction('GetAllPolicies');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Now let's try to submit a transaction.
// 			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
// 			// to the orderer to be committed by each of the peer's to the channel ledger.
// 			console.log('\n--> Submit Transaction: CreatePolicy, creates new asset with id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration and durationInDays arguments');
// 			result = await contract.submitTransaction(
// 				'CreatePolicy',
// 				"177347GHFGWB2",
// 				"Sotiria",
// 				"NavigationData",
// 				"Read",
// 				"Commercial",
// 				"recepient_name_1",
// 				"Asia",
// 				"365",
// 				"365");
// 			// The "submitTransaction" returns the value generated by the chaincode. Notice how we normally do not
// 			// look at this value as the chaincodes are not returning a value. So for demonstration purposes we
// 			// have the javascript version of the chaincode return a value on the function 'CreatePolicy'.
// 			// This value will be the same as the 'ReadPolicy' results for the newly created asset.
// 			// The other chaincode versions could be updated to also return a value.
// 			// Having the chaincode return a value after after doing a create or update could avoid the application
// 			// from making an "evaluateTransaction" call to get information on the asset added by the chaincode
// 			// during the create or update.
// 			console.log(`*** Result committed: ${prettyJSONString(result.toString())}`);

// 			console.log('\n--> Evaluate Transaction: ReadPolicy, function returns an asset with a given assetID');
// 			result = await contract.evaluateTransaction('ReadPolicy', '177347GHFGWB2');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			console.log('\n--> Evaluate Transaction: PolicyExists, function returns "true" if an asset with given assetID exist');
// 			result = await contract.evaluateTransaction('PolicyExists', '177347GHFGWB9');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			console.log('\n--> Submit Transaction: UpdatePolicy asset1, change the appraisedValue to 350');
// 			await contract.submitTransaction(
// 				'UpdatePolicy',
// 				"177347GHFGWB9",
// 				"John",
// 				"NavigationData",
// 				"Read",
// 				"NonCommercial",
// 				"recepient_name_1", //update
// 				"Asia", //update
// 				"365",
// 				"365");
// 			console.log('*** Result: committed');

// 			console.log('\n--> Evaluate Transaction: ReadPolicy, function returns "asset1" attributes');
// 			result = await contract.evaluateTransaction('ReadPolicy', '177347GHFGWB9');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			try {
// 				// How about we try a transactions where the executing chaincode throws an error
// 				// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
// 				console.log('\n--> Submit Transaction: UpdatePolicy asset70, asset70 does not exist and should return an error');
// 				await contract.submitTransaction('UpdatePolicy', 'asset70', 'blue', '5', 'Tomoko', '300');
// 				console.log('******** FAILED to return an error');
// 			} catch (error) {
// 				console.log(`*** Successfully caught the error: \n    ${error}`);
// 			}

// 			console.log('\n--> Submit Transaction: TransferPolicy asset1, transfer to new owner of Tom');
// 			await contract.submitTransaction('TransferPolicy', '177347GHFGWB9', 'Tom');
// 			console.log('*** Result: committed');

// 			console.log('\n--> Evaluate Transaction: ReadPolicy, function returns "asset1" attributes');
// 			result = await contract.evaluateTransaction('ReadPolicy', '177347GHFGWB9');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
// 		} finally {
// 			// Disconnect from the gateway when the application is closing
// 			// This will close all connections to the network
// 			gateway.disconnect();
// 		}
// 	} catch (error) {
// 		console.error(`******** FAILED to run the application: ${error}`);
// 	}
// }

// function prettyJSONString(inputString) {
// 	return JSON.stringify(JSON.parse(inputString), null, 2);
// }

// async function init() {
// 	try {
// 		// build an in memory object with the network configuration (also known as a connection profile)
// 		const ccp = buildCCPOrg1();

// 		// build an instance of the fabric ca services client based on
// 		// the information in the network configuration
// 		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

// 		// setup the wallet to hold the credentials of the application user
// 		const wallet = await buildWallet(Wallets, walletPath);

// 		// in a real application this would be done on an administrative flow, and only once
// 		await enrollAdmin(caClient, wallet, mspOrg1);

// 		// in a real application this would be done only when a new user was required to be added
// 		// and would be part of an administrative flow
// 		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

// 		// Create a new gateway instance for interacting with the fabric network.
// 		// In a real application this would be done as the backend server session is setup for
// 		// a user that has been verified.
// 		const gateway = new Gateway();

// 		try {
// 			// setup the gateway instance
// 			// The user will now be able to create connections to the fabric network and be able to
// 			// submit transactions and query. All transactions submitted by this gateway will be
// 			// signed by this user using the credentials stored in the wallet.
// 			await gateway.connect(ccp, {
// 				wallet,
// 				identity: org1UserId,
// 				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
// 			});

// 			// Build a network instance based on the channel where the smart contract is deployed
// 			const network = await gateway.getNetwork(channelName);

// 			// Get the contract from the network.
// 			contract = network.getContract(chaincodeName);
// 		} finally {
// 			// Disconnect from the gateway when the application is closing
// 			// This will close all connections to the network
// 			gateway.disconnect();
// 		}
// 	} catch (error) {
// 		console.error(`******** FAILED to run the application: ${error}`);
// 	}
// }

// async function initPolicies() {
// 	// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
// 	// This type of transaction would only be run once by an application the first time it was started after it
// 	// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
// 	// an "init" type function.
// 	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
// 	await contract.submitTransaction('InitLedger');
// 	return "*** Result: committed";
// }

// async function createPolicy(id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration, durationInDays) {
// 	// Now let's try to submit a transaction.
// 	// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
// 	// to the orderer to be committed by each of the peer's to the channel ledger.
// 	console.log('\n--> Submit Transaction: CreatePolicy, creates new asset with id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration and durationInDays arguments');
// 	let result = await contract.submitTransaction(
// 		'CreatePolicy',
// 		id,
// 		hasDataSubject,
// 		hasPersonalDataCategory,
// 		hasProcessing,
// 		hasPurpose,
// 		hasRecipient,
// 		hasLocation,
// 		hasDuration,
// 		durationInDays);
// 	// The "submitTransaction" returns the value generated by the chaincode. Notice how we normally do not
// 	// look at this value as the chaincodes are not returning a value. So for demonstration purposes we
// 	// have the javascript version of the chaincode return a value on the function 'CreatePolicy'.
// 	// This value will be the same as the 'ReadPolicy' results for the newly created asset.
// 	// The other chaincode versions could be updated to also return a value.
// 	// Having the chaincode return a value after after doing a create or update could avoid the application
// 	// from making an "evaluateTransaction" call to get information on the asset added by the chaincode
// 	// during the create or update.
// 	return (`*** Result committed: ${prettyJSONString(result.toString())}`);
// }

// async function getAllPolicies() {
// 	// Let's try a query type operation (function).
// 	// This will be sent to just one peer and the results will be shown.
// 	console.log('\n--> Evaluate Transaction: GetAllPolicies, function returns all the current assets on the ledger');
// 	let result = await contract.evaluateTransaction('GetAllPolicies');
// 	return `*** Result: ${prettyJSONString(result.toString())}`;
// }

// async function readPolicy(id) {
// 	console.log('\n--> Evaluate Transaction: ReadPolicy, function returns an asset with a given assetID');
// 	let result = await contract.evaluateTransaction('ReadPolicy', id.toString());
// 	return (`*** Result: ${prettyJSONString(result.toString())}`);
// }

// async function policyExists(id) {
// 	console.log('\n--> Evaluate Transaction: PolicyExists, function returns "true" if an asset with given assetID exist');
// 	let result = await contract.evaluateTransaction('PolicyExists', id);
// 	return (`*** Result: ${prettyJSONString(result.toString())}`);
// }

// async function updatePolicy(id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration, durationInDays) {
// 	console.log('\n--> Submit Transaction: UpdatePolicy asset1, change the appraisedValue to 350');
// 	await contract.submitTransaction(
// 		'UpdatePolicy',
// 		id,
// 		hasDataSubject,
// 		hasPersonalDataCategory,
// 		hasProcessing,
// 		hasPurpose,
// 		hasRecipient,
// 		hasLocation,
// 		hasDuration,
// 		durationInDays);
// 	return ('*** Result: committed');
// }

// async function transferPolicy(id, owner) {
// 	console.log('\n--> Submit Transaction: TransferPolicy asset1, transfer to new owner of Tom');
// 	await contract.submitTransaction('TransferPolicy', id, owner);
// 	return ('*** Result: committed');
// }

// // main();
