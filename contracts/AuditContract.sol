// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "cartesi-coprocessor-base-contract/BaseContract.sol";

contract AuditContract is CoprocessorAdapter {
    // Events
    event AuditRequested(address indexed requester, string contractSource);
    event AuditCompleted(address indexed requester, bytes result);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    // Function to request an audit
    function requestAudit(string calldata contractSource) external {
        emit AuditRequested(msg.sender, contractSource);

        // Encode the input for the Cartesi Machine
        bytes memory input = abi.encode(contractSource);
        
        // Call the Coprocessor with the encoded input
        callCoprocessor(input);
    }

    // Override handleNotice to process the audit results
    function handleNotice(bytes calldata _notice) internal override {
        emit AuditCompleted(msg.sender, _notice);
    }
}
