// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract Treasury {
    address public governance;

    modifier onlyGov() {
        require(msg.sender == governance, "Not governance");
        _;
    }

    constructor(address _gov) {
        governance = _gov;
    }

    function withdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyGov {
        IERC20(token).transfer(to, amount);
    }
}