/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const policyChaincode = require('./lib/policy-chaincode');

module.exports.PolicyChaincode = policyChaincode;
module.exports.contracts = [policyChaincode];
