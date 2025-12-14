// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LaunchToken is ERC20 {
    address public factory;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        address owner_
    ) ERC20(name_, symbol_) {
        factory = msg.sender;
        _mint(owner_, supply_);
    }
}