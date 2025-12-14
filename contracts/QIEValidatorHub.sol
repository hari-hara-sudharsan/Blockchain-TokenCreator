// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract QIEValidatorHub {
    struct Validator {
        uint256 stake;
        bool active;
    }

    mapping(address => Validator) public validators;
    uint256 public minimumStake = 1000 ether;

    event ValidatorStaked(address indexed validator, uint256 amount);
    event ValidatorUnstaked(address indexed validator, uint256 amount);
    event ValidatorSlashed(address indexed validator, uint256 amount);

    function stake() external payable {
        require(msg.value >= minimumStake, "Stake too low");

        validators[msg.sender].stake += msg.value;
        validators[msg.sender].active = true;

        emit ValidatorStaked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        Validator storage v = validators[msg.sender];
        require(v.stake >= amount, "Insufficient stake");

        v.stake -= amount;
        if (v.stake == 0) v.active = false;

        payable(msg.sender).transfer(amount);
        emit ValidatorUnstaked(msg.sender, amount);
    }

    // Called later by governance / oracle
    function slash(address validator, uint256 amount) external {
        Validator storage v = validators[validator];
        require(v.stake >= amount, "Too much slash");

        v.stake -= amount;
        emit ValidatorSlashed(validator, amount);
    }
}