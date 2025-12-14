// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
    function burn(uint256 amount) external;
}

contract LPVault {
    address public governance;
    uint256 public unlockTime;

    event LPBurned(uint256 amount);
    event LPReleased(address to, uint256 amount);

    modifier onlyGov() {
        require(msg.sender == governance, "Not governance");
        _;
    }

    constructor(address _governance, uint256 _unlockTime) {
        governance = _governance;
        unlockTime = _unlockTime;
    }

    // -------- BURN LP FOREVER --------
    function burnLP(address lpToken) external onlyGov {
        uint256 bal = IERC20(lpToken).balanceOf(address(this));
        require(bal > 0, "No LP");

        IERC20(lpToken).burn(bal);
        emit LPBurned(bal);
    }

    // -------- RELEASE AFTER LOCK --------
    function releaseLP(address lpToken, address to) external onlyGov {
        require(block.timestamp >= unlockTime, "Still locked");

        uint256 bal = IERC20(lpToken).balanceOf(address(this));
        require(bal > 0, "No LP");

        IERC20(lpToken).transfer(to, bal);
        emit LPReleased(to, bal);
    }
}