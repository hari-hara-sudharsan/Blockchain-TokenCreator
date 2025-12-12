// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import { FairLaunchToken, SafeMintFactory } from "./SafeMintTokenFactory.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// contract SafeMintLaunchPad is ReentrancyGuard {
//     struct LaunchInfo {
//         address owner;
//         address token;
//         uint256 totalSupply;
//         uint256 liquidityQIE; // amount of native QIE deposited with launch
//         uint256 lockMonths;
//         uint256 unlockTime;
//         uint8 trustScore; // 2 = green, 1 = yellow, 0 = red
//         bool withdrawn;
//         string imageCid; // for offchain use
//     }

//     mapping(address => LaunchInfo) public launches;

//     event Launched(
//         address indexed owner,
//         address indexed token,
//         uint256 totalSupply,
//         uint256 liquidityQIE,
//         uint256 lockMonths,
//         uint256 unlockTime
//     );

//     event LPWithdrawn(address indexed owner, address indexed token, uint256 amount);

//     /**
//      * @notice Creates a Fair token, mints supply once to creator, locks minting,
//      * and stores native liquidity (msg.value) inside this contract for demo.
//      */
//     function launchFairToken(
//         string memory name,
//         string memory symbol,
//         uint256 totalSupply,
//         uint256 liquidityQIE,
//         uint256 lockMonths,
//         string memory imageCid
//     ) external payable nonReentrant {
//         require(msg.value == liquidityQIE, "Incorrect liquidity sent");
//         require(lockMonths >= 6, "Minimum lock is 6 months");
//         require(totalSupply > 0, "Supply must be > 0");

//         // Deploy factory and token (demo approach)
//         SafeMintFactory factory = new SafeMintFactory();
//         address tokenAddr = factory.createToken(name, symbol);

//         FairLaunchToken token = FairLaunchToken(tokenAddr);

//         // Mint supply ONCE to the creator
//         token.mint(msg.sender, totalSupply);

//         // Lock minting permanently
//         token.lockMinting();

//         uint256 unlockTime = block.timestamp + (lockMonths * 30 days);

//         launches[tokenAddr] = LaunchInfo({
//             owner: msg.sender,
//             token: tokenAddr,
//             totalSupply: totalSupply,
//             liquidityQIE: liquidityQIE,
//             lockMonths: lockMonths,
//             unlockTime: unlockTime,
//             trustScore: 2,
//             withdrawn: false,
//             imageCid: imageCid
//         });

//         emit Launched(msg.sender, tokenAddr, totalSupply, liquidityQIE, lockMonths, unlockTime);
//     }

//     /**
//      * @notice Owner can withdraw their locked liquidity after unlock time.
//      * For demo this returns the stored native liquidity to the owner.
//      */
//     function withdrawLP(address token) external nonReentrant {
//         LaunchInfo storage info = launches[token];
//         require(info.owner != address(0), "No launch found");
//         require(msg.sender == info.owner, "Not owner");
//         require(block.timestamp >= info.unlockTime, "Locked");
//         require(!info.withdrawn, "Already withdrawn");
//         uint256 amt = info.liquidityQIE;
//         require(amt > 0, "No liquidity");

//         info.withdrawn = true;

//         // send native QIE back to owner
//         (bool ok, ) = info.owner.call{ value: amt }("");
//         require(ok, "Transfer failed");

//         emit LPWithdrawn(info.owner, token, amt);
//     }

//     /**
//      * @notice View function returning launch metadata
//      */
//     function getLaunchDetails(address token) external view returns (
//         address owner,
//         address tokenAddress,
//         uint256 totalSupply,
//         uint256 liquidityQIE,
//         uint256 lockMonths,
//         uint256 unlockTime,
//         uint8 trustScore,
//         bool withdrawn,
//         string memory imageCid
//     ) {
//         LaunchInfo storage info = launches[token];
//         owner = info.owner;
//         tokenAddress = info.token;
//         totalSupply = info.totalSupply;
//         liquidityQIE = info.liquidityQIE;
//         lockMonths = info.lockMonths;
//         unlockTime = info.unlockTime;
//         trustScore = info.trustScore;
//         withdrawn = info.withdrawn;
//         imageCid = info.imageCid;
//     }

//     /**
//      * @notice Basic trust score check for demo:
//      * - 2: minted once, locked minting, liquidity >= 0 and owner != zero
//      * - 1: partial
//      * - 0: fail
//      *
//      * For real checks you'd verify owner holdings, LP ownership, etc.
//      */
//     function trustScore(address token) external view returns (uint8) {
//         LaunchInfo storage info = launches[token];
//         if (info.owner == address(0)) return 0;
//         if (info.unlockTime >= block.timestamp + 6 * 30 days && info.totalSupply > 0) {
//             return info.trustScore; // we set 2 at launch for demo
//         }
//         return 1;
//     }

//     // Allow contract to receive native currency (shouldn't be used externally)
//     receive() external payable {}
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LaunchPad {
  struct Launch { address owner; address token; uint256 supply; uint256 liquidity; uint256 unlock; }
  event Launched(address indexed owner, address indexed token, uint256 supply, uint256 liquidity, uint256 unlock);

  function emitTestLaunch(address token, uint256 supply, uint256 liquidity, uint256 unlock) external {
    emit Launched(msg.sender, token, supply, liquidity, unlock);
  }
}
