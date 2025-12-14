// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ValidatorHub {
    struct Validator {
        uint256 stake;
        bool active;
    }

    mapping(address => Validator) public validators;
    uint256 public minStake = 1000 ether;

    event Staked(address indexed validator, uint256 amount);
    event Unstaked(address indexed validator);
    event Slashed(address indexed validator, uint256 amount);

    function stake() external payable {
        require(msg.value >= minStake, "Insufficient stake");

        validators[msg.sender].stake += msg.value;
        validators[msg.sender].active = true;

        emit Staked(msg.sender, msg.value);
    }

    function unstake() external {
        Validator storage v = validators[msg.sender];
        require(v.active, "Not active");

        uint256 amount = v.stake;
        v.stake = 0;
        v.active = false;

        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender);
    }

    function slash(address validator, uint256 amount) external {
        // In Phase 4 this is restricted to Governance contract
        Validator storage v = validators[validator];
        require(v.stake >= amount, "Too much slash");

        v.stake -= amount;
        emit Slashed(validator, amount);
    }
}