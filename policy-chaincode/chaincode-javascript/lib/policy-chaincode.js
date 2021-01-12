/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PolicyChaincode extends Contract {

    async InitLedger(ctx) {
        const policies = [
            {
                created: 1608288951,
                modified: 1608288951,
                id: "177347GHFGWB9",
                hasDataSubject: "John",
                OwnerID: ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
                hasPersonalDataCategory: "NavigationData",
                hasProcessing: "Read",
                hasPurpose: "NonCommercial",
                hasRecipient: "null || recepient_name_1 || other_term",
                hasStorage: {
                    hasLocation: "Europe",
                    hasDuration: "365",
                    durationInDays: "365",
                },
            },
            { // new policy
                created: 1608288951,
                modified: 1608288951,
                id: "177347GHFGWB1",
                hasDataSubject: "Beth",
                OwnerID: ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
                hasPersonalDataCategory: "PersonalData",
                hasProcessing: "Read",
                hasPurpose: "Analysis",
                hasRecipient: "null || recepient_name_1 || other_term",
                hasStorage: {
                    hasLocation: "Asia",
                    hasDuration: "365",
                    durationInDays: "365",
                },
            },
            { // new policy
                created: 1608288951,
                modified: 1608288951,
                id: "177347GHFGWB0",
                hasDataSubject: "Syd",
                OwnerID: ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
                hasPersonalDataCategory: "PseudonymizedData",
                hasProcessing: "Read",
                hasPurpose: "NonCommercial",
                hasRecipient: "recepient_name_1",
                hasStorage: {
                    hasLocation: "USA",
                    hasDuration: "365",
                    durationInDays: "365",
                },
            },
        ];

        for (const policy of policies) {
            policy.docType = 'policy';
            await ctx.stub.putState(policy.id, Buffer.from(JSON.stringify(policy)));
            console.info(`policy ${policy.id} initialized`);
        }
    }

    // CreatePolicy issues a new policy to the world state with given details.
    async CreatePolicy(ctx, id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration, durationInDays) {
        const policyExists = await this.PolicyExists(ctx, id);
        console.log("edw: ", policyExists);
        if (policyExists) {
            throw new Error(`The policy ${id} already exist`);
        }

        const policy = { // new policy
            created: 1608288951,
            modified: 1608288951,
            id: id,
            hasDataSubject: hasDataSubject,
            OwnerID: ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
            hasPersonalDataCategory: hasPersonalDataCategory,
            hasProcessing: hasProcessing,
            hasPurpose: hasPurpose,
            hasRecipient: hasRecipient,
            hasStorage: {
                hasLocation: hasLocation,
                hasDuration: hasDuration,
                durationInDays: durationInDays,
            },
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(policy)));
        return JSON.stringify(policy);
    }

    // ReadPolicy returns the policy stored in the world state with given id.
    async ReadPolicy(ctx, id) {
        const policyJSON = await ctx.stub.getState(id); // get the policy from chaincode state
        if (!policyJSON || policyJSON.length === 0) {
            throw new Error(`The policy ${id} does not exist`);
        }
        return policyJSON.toString();
    }

    // UpdatePolicy updates an existing policy in the world state with provided parameters.
    async UpdatePolicy(ctx, id, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasLocation, hasDuration, durationInDays) {
        const exists = await this.PolicyExists(ctx, id);
        if (!exists) {
            throw new Error(`The policy ${id} does not exist`);
        }
        const policyString = await this.ReadPolicy(ctx, id);
        const policy = JSON.parse(policyString);
        console.log("edw: ", policy);
        if (policy.OwnerID !== ctx.clientIdentity.getID().split("::")[1].split("CN=")[1]) {
            throw new Error(
                `policy ${id} does not belong to this user. Update is prohibited`
            );
        }
        // overwriting original policy with new policy
        const updatedPolicy = { // update policy
            created: 1608288951,
            modified: 1608288951,
            id: id,
            hasDataSubject: hasDataSubject,
            OwnerID: ctx.clientIdentity.getID().split("::")[1].split("CN=")[1],
            hasPersonalDataCategory: hasPersonalDataCategory,
            hasProcessing: hasProcessing,
            hasPurpose: hasPurpose,
            hasRecipient: hasRecipient,
            hasStorage: {
                hasLocation: hasLocation,
                hasDuration: hasDuration,
                durationInDays: durationInDays,
            },
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedPolicy)));
    }

    // DeletePolicy deletes an given policy from the world state.
    async DeletePolicy(ctx, id) {
        const exists = await this.PolicyExists(ctx, id);
        if (!exists) {
            throw new Error(`The policy ${id} does not exist`);
        }

        const policyString = await this.ReadPolicy(ctx, id);
        const policy = JSON.parse(policyString);
        console.log("edw: ", policy);
        if (policy.OwnerID == ctx.clientIdentity.getID().split("::")[1].split("CN=")[1]) {
            return ctx.stub.deleteState(id);
        } else {
            throw new Error(`policy ${id} does not belong to this user. Update is prohibited`);
        }
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
        policy.hasDataSubject = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(policy)));
    }

    // GetAllPolicys returns all policies found in the world state.
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

module.exports = PolicyChaincode;
