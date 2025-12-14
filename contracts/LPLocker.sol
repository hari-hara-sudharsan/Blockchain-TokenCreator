// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LPLocker {
    struct Lock {
        uint256 amount;
        uint256 unlockTime;
    }

    mapping(address => Lock) public locks;
    address public burner;

    constructor(address _burner) {
        burner = _burner;
    }

    function lockLP(address lpToken, uint256 amount, uint256 unlockTime) external {
        require(locks[lpToken].amount == 0, "Already locked");
        require(unlockTime > block.timestamp, "Unlock in past");

        // In a real contract you'd transferFrom LP tokens to this contract.
        locks[lpToken] = Lock({ amount: amount, unlockTime: unlockTime });
    }

    function unlockAndBurn(address lpToken) external {
        Lock storage l = locks[lpToken];
        require(l.amount > 0, "No lock");
        require(block.timestamp >= l.unlockTime, "Still locked");

        uint256 amount = l.amount;
        l.amount = 0;

        IERC20(lpToken).transfer(burner, amount);
    }
}
