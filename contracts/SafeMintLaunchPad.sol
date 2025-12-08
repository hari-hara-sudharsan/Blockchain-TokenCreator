// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SafeMintTokenFactory.sol";

contract SafeMintLaunchPad {

    struct LaunchInfo {
        address owner;
        address token;
        uint256 totalSupply;
        uint256 liquidityAmount;  // virtual liquidity for demo
        uint256 lockMonths;
        uint256 unlockTime;
        uint8 trustScore; // 2 = green
    }

    mapping(address => LaunchInfo) public launches;

    SafeMintFactory public factory;

    event TokenLaunched(address indexed owner, address indexed token, uint256 supply, uint256 unlockTime);

    constructor(address _factory) {
        require(_factory != address(0), "factory required");
        factory = SafeMintFactory(_factory);
    }

    /**
     * @notice Launches a FairLaunch token with virtual liquidity lock (router will be added later)
     */
    function launchFairToken(
        string memory name,
        string memory symbol,
        uint256 supply,
        uint256 liquidityAmount,
        uint256 lockMonths
    ) external payable {

        require(lockMonths >= 6, "Minimum lock = 6 months");
        require(supply > 0, "Supply required");

        // 1. Create token through factory
        address token = factory.createToken(name, symbol);
        FairLaunchToken flt = FairLaunchToken(token);

        // 2. Mint supply → LaunchPad (central control)
        flt.mint(address(this), supply);

        // 3. Permanently lock minting
        flt.lockMinting();

        // 4. Store virtual LP lock metadata
        uint256 unlockTime = block.timestamp + lockMonths * 30 days;

        launches[token] = LaunchInfo({
            owner: msg.sender,
            token: token,
            totalSupply: supply,
            liquidityAmount: liquidityAmount,
            lockMonths: lockMonths,
            unlockTime: unlockTime,
            trustScore: 2 // GREEN badge
        });

        emit TokenLaunched(msg.sender, token, supply, unlockTime);
    }

    /**
     * @notice Simulated LP unlock — real LP unlock will replace this later.
     */
    function unlockLiquidity(address token) external {
        LaunchInfo storage info = launches[token];
        require(info.owner == msg.sender, "Not token owner");
        require(block.timestamp >= info.unlockTime, "Still locked");

        // In real router integration, LP tokens will be sent here.
        // For Sim version: just delete lock info
        info.liquidityAmount = 0;
    }

    /// @notice Frontend helper
    function getLaunchDetails(address token) external view returns (LaunchInfo memory) {
        return launches[token];
    }
}

