// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QIEToken is ERC20 {
    constructor(uint256 supply) ERC20("QIE Network Token", "QIE") {
        _mint(msg.sender, supply);
    }
}