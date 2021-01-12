const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("../../../../test-application/javascript/AppUtil");
const { buildCAClient, registerAndEnrollUser } = require("../../../../test-application/javascript/CAUtil"); const path = require("path");
const walletPath = path.join(__dirname, "..", "wallet");

class UserController {
    async enrollUser(request, response, next) {
        const { userID: org1UserId, organization: mspOrg1 } = request.body;

        console.log(`User: ${org1UserId} is about to be initialized for organization ${mspOrg1}`);

        try {
            const ccp = buildCCPOrg1();
            const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
            const wallet = await buildWallet(Wallets, walletPath);

            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");

            return response.status(201).json({ message: `User ${org1UserId} is successfully enrolled in organization ${mspOrg1}` })
        } catch (error) {
            console.log("****Error", error);
            return response.status(500).json({
                message: "Failed to enroll user",
                error: error.message
            });
        }
    }
}

module.exports = UserController;