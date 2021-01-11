/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
    // InitLedger initializes the ledger.
    async InitLedger(ctx) {
        const policies = [
            {
                "PolicyId": "1",
                "CreationDate": "2021-01-11T15:32:20.211Z",
                "HasDataSubject": "John Doe",
                "OwnerID": ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
                "HasPersonalDataCategory": "NavigationData",
                "HasProcessing": "Read",
                "HasPurpose": "NonCommercial",
                "HasRecipient": "recipient identification",
                "HasStorage": {
                    "HasLocation": "Europe",
                    "HasDuration": "365",
                    "DurationInDays": "365"
                }
            },
            {
                "PolicyId": "2",
                "CreationDate": "2023-01-24T09:00:08+01:00",
                "HasDataSubject": "Jane Doe",
                "OwnerID": ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
                "HasPersonalDataCategory": "NavigationData",
                "HasProcessing": "Read",
                "HasPurpose": "NonCommercial",
                "HasRecipient": "recipient identification",
                "HasStorage": {
                    "HasLocation": "Europe",
                    "HasDuration": "365",
                    "DurationInDays": "365"
                }
            },
        ];

        for (const policy of policies) {
            policy.docType = 'policy';
            await ctx.stub.putState(policy.PolicyId, Buffer.from(JSON.stringify(policy)));
            console.info(`Policy ${policy.PolicyId} initialized`);
        }
    }

    // CreatePolicy issues a new policy to the world state with given details.
    async CreatePolicy(ctx, id, creationDate, dataSubject, personalDataCategory, processing, purpose, recipient, location, duration) {
        const policy = {
            "PolicyId": id,
            "CreationDate": creationDate,
            "HasDataSubject": dataSubject,
            "OwnerID": ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
            "HasPersonalDataCategory": personalDataCategory,
            "HasProcessing": processing,
            "HasPurpose": purpose,
            "HasRecipient": recipient,
            "HasStorage": {
                "HasLocation": location,
                "HasDuration": duration,
                "DurationInDays": duration
            }
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(policy)));
        return JSON.stringify(policy);
    }

    // ReadPolicy returns the policy stored in the world state with given id.
    async ReadPolicy(ctx, id) {
        const policyJSON = await ctx.stub.getState(id); // get the policy from chaincode state
        if (!policyJSON || policyJSON.length === 0) throw new Error(`The policy ${id} does not exist`);
        return policyJSON.toString();
    }

    // UpdatePolicy updates an existing policy in the world state with provided parameters.
    async UpdatePolicy(ctx, id, creationDate, dataSubject, personalDataCategory, processing, purpose, recipient, location, duration) {
        const exists = await this.PolicyExists(ctx, id);
        if (!exists) throw new Error(`The policy ${id} does not exist`);

        // overwriting original policy with new policy
        const updatedPolicy = {
            "PolicyId": id,
            "CreationDate": creationDate,
            "HasDataSubject": dataSubject,
            "OwnerID": ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
            "HasPersonalDataCategory": personalDataCategory,
            "HasProcessing": processing,
            "HasPurpose": purpose,
            "HasRecipient": recipient,
            "HasStorage": {
                "HasLocation": location,
                "HasDuration": duration,
                "DurationInDays": duration
            }
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedPolicy)));
    }

    // DeletePolicy deletes an given policy from the world state.
    async DeletePolicy(ctx, id) {
        const exists = await this.PolicyExists(ctx, id);
        if (!exists) throw new Error(`The policy ${id} does not exist`);
        return ctx.stub.deleteState(id);
    }

    // PolicyExists returns true when policy with given ID exists in world state.
    async PolicyExists(ctx, id) {
        const policyJSON = await ctx.stub.getState(id);
        return policyJSON && policyJSON.length > 0;
    }

    // TransferPolicy updates the owner field of policy with given id in the world state.
    async TransferPolicy(ctx, id, newOwner) {
        const policyString = await this.ReadPolicy(ctx, id);
        const policy = JSON.parse(policyString);
        policy.OwnerID = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(policy)));
    }

    // GetAllPolicies returns all policies found in the world state.
    async GetAllPolicies(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all policies in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
