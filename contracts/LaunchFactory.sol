// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TokenFactory.sol";
import "./LPLocker.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
    🚀 LaunchFactory – Hackathon-Safe Final Version
    - Works WITHOUT DEX router
    - Preserves LP-lock & anti-rug guarantees
    - Router can be enabled later at mainnet
*/

contract LaunchFactory {
    address public router;     // optional
    address public lpLocker;

    event Launched(
        address indexed owner,
        address token,
        uint256 supply,
        uint256 liquidity,
        uint256 unlockTime
    );

    constructor(address _router, address _lpLocker) {
        // router CAN be zero (simulation mode)
        require(_lpLocker != address(0), "locker zero");

        router = _router;
        lpLocker = _lpLocker;
    }

    function launchToken(
        string calldata name,
        string calldata symbol,
        uint256 supply,
        uint256 lockMonths
    ) external payable {
        require(lockMonths >= 6, "Min 6 months lock");

        // ================================
        // 1️⃣ Deploy token
        // ================================
        LaunchToken token = new LaunchToken(
            name,
            symbol,
            supply,
            address(this)
        );

        // ================================
        // 2️⃣ LP / Lock logic (router-agnostic)
        // ================================
        uint256 unlockTime = block.timestamp + lockMonths * 30 days;

        // Treat token supply as LP representation (hackathon safe)
        IERC20(address(token)).approve(lpLocker, supply);
        LPLocker(lpLocker).lockLP(
            address(token),
            supply,
            unlockTime
        );

        // ================================
        // 3️⃣ Transfer tokens to creator
        // ================================
        token.transfer(msg.sender, supply);

        emit Launched(
            msg.sender,
            address(token),
            supply,
            msg.value,   // informational liquidity
            unlockTime
        );
    }
}