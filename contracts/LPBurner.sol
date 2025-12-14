// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LPBurner {
    address public constant DEAD =
        0x000000000000000000000000000000000000dEaD;

    event LPBurned(address indexed lpToken, uint256 amount);

    function burnLP(address lpToken) external {
        uint256 balance = IERC20(lpToken).balanceOf(address(this));
        require(balance > 0, "No LP to burn");

        IERC20(lpToken).transfer(DEAD, balance);

        emit LPBurned(lpToken, balance);
    }
}