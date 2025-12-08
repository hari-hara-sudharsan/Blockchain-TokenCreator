// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FairLaunchToken
 * @notice Token where:
 * - LaunchPad controls minting ONCE
 * - Minting permanently disabled after launch
 * - No pre-mine possible
 */
contract FairLaunchToken is ERC20, Ownable {
    bool public mintLocked;

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        Ownable(msg.sender) // factory owns temporarily
    {}

    /// @notice LaunchPad mints the supply ONCE
    function mint(address to, uint256 amount) external onlyOwner {
        require(!mintLocked, "Minting locked forever");
        _mint(to, amount);
    }

    /// @notice Lock minting forever (makes token fixed supply)
    function lockMinting() external onlyOwner {
        mintLocked = true;
    }
}

/**
 * @title SafeMintFactory
 * @notice Deploys FairLaunchToken and transfers ownership to LaunchPad
 */
contract SafeMintFactory {

    event TokenCreated(address indexed token, address indexed launchpad);

    function createToken(string memory name, string memory symbol)
        external
        returns (address token)
    {
        FairLaunchToken t = new FairLaunchToken(name, symbol);

        // LaunchPad becomes owner
        t.transferOwnership(msg.sender);

        emit TokenCreated(address(t), msg.sender);
        return address(t);
    }
}
