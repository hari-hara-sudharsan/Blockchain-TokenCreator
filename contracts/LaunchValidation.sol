// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IValidatorRegistry {
    function isValidator(address user) external view returns (bool);
}

contract LaunchValidation {
    IValidatorRegistry public registry;

    mapping(address => uint256) public approvals;
    mapping(address => uint256) public rejections;

    uint256 public constant REQUIRED_APPROVALS = 3;

    event Approved(address indexed token, address validator);
    event Rejected(address indexed token, address validator);

    constructor(address _registry) {
        registry = IValidatorRegistry(_registry);
    }

    function approve(address token) external {
        require(registry.isValidator(msg.sender), "Not validator");
        approvals[token]++;
        emit Approved(token, msg.sender);
    }

    function reject(address token) external {
        require(registry.isValidator(msg.sender), "Not validator");
        rejections[token]++;
        emit Rejected(token, msg.sender);
    }

    function isTrusted(address token) external view returns (bool) {
        return approvals[token] >= REQUIRED_APPROVALS &&
               approvals[token] > rejections[token];
    }
}