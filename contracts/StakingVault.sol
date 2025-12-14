// contracts/StakingVault.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract StakingVault {
    mapping(address => uint256) public balances;
    uint256 public totalStaked;
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    function stake() payable external {
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient");
        balances[msg.sender] -= amount;
        totalStaked -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }
}