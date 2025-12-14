// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LiquidityLocker {

    struct Lock {
        address owner;
        uint256 unlockTime;
        bool burned;
    }

    mapping(address => Lock) public locks;

    function lockLP(address lpToken, uint256 unlockTime) external {
        require(locks[lpToken].owner == address(0), "Already locked");

        locks[lpToken] = Lock({
            owner: msg.sender,
            unlockTime: unlockTime,
            burned: false
        });
    }

    function burnLP(address lpToken) external {
        Lock storage l = locks[lpToken];
        require(msg.sender == l.owner, "Not owner");
        require(block.timestamp >= l.unlockTime, "Still locked");

        l.burned = true;
        // LP burn logic here (send to 0xdead)
    }
}