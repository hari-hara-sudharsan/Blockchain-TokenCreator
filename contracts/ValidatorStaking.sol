// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ValidatorStaking {
    uint256 public constant MIN_STAKE = 10 ether;
    uint256 public rewardRate = 5; // % per epoch

    struct Validator {
        uint256 stake;
        uint256 lastClaim;
        bool active;
    }

    mapping(address => Validator) public validators;
    address public admin;

    event Staked(address indexed validator, uint256 amount);
    event Unstaked(address indexed validator, uint256 amount);
    event RewardClaimed(address indexed validator, uint256 reward);
    event Slashed(address indexed validator, uint256 penalty);

    constructor() {
        admin = msg.sender;
    }

    function stake() external payable {
        require(msg.value >= MIN_STAKE, "Insufficient stake");

        Validator storage v = validators[msg.sender];
        v.stake += msg.value;
        v.lastClaim = block.timestamp;
        v.active = true;

        emit Staked(msg.sender, msg.value);
    }

    function claimRewards() external {
        Validator storage v = validators[msg.sender];
        require(v.active, "Not validator");

        uint256 reward = (v.stake * rewardRate) / 100;
        v.lastClaim = block.timestamp;

        payable(msg.sender).transfer(reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function unstake() external {
        Validator storage v = validators[msg.sender];
        require(v.active, "Not validator");

        uint256 amount = v.stake;
        v.stake = 0;
        v.active = false;

        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }

    function slash(address validator, uint256 amount) external {
        require(msg.sender == admin, "Only admin");

        Validator storage v = validators[validator];
        require(v.stake >= amount, "Too much slash");

        v.stake -= amount;
        emit Slashed(validator, amount);
    }
}
