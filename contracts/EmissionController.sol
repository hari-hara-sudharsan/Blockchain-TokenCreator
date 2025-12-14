// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IQIEToken {
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IValidatorRegistry {
    function validators(address)
        external
        view
        returns (uint256 stake, bool active, uint256 joinedAt);

    function totalStaked() external view returns (uint256);
}

contract EmissionController {
    IQIEToken public immutable qie;
    IValidatorRegistry public immutable registry;

    uint256 public rewardPerEpoch;
    uint256 public epochDuration = 1 days;
    uint256 public lastEpochTime;

    mapping(address => uint256) public pendingRewards;

    event RewardsDistributed(uint256 amount);
    event RewardClaimed(address validator, uint256 amount);

    constructor(
        address _qie,
        address _registry,
        uint256 _rewardPerEpoch
    ) {
        qie = IQIEToken(_qie);
        registry = IValidatorRegistry(_registry);
        rewardPerEpoch = _rewardPerEpoch;
        lastEpochTime = block.timestamp;
    }

    // -------- DISTRIBUTE --------
    function distribute(address[] calldata validatorList) external {
        require(block.timestamp >= lastEpochTime + epochDuration, "Epoch not ended");

        uint256 totalStake = registry.totalStaked();
        require(totalStake > 0, "No stake");

        for (uint256 i = 0; i < validatorList.length; i++) {
            (uint256 stake, bool active,) =
                registry.validators(validatorList[i]);

            if (!active || stake == 0) continue;

            uint256 reward = (rewardPerEpoch * stake) / totalStake;
            pendingRewards[validatorList[i]] += reward;
        }

        lastEpochTime = block.timestamp;
        emit RewardsDistributed(rewardPerEpoch);
    }

    // -------- CLAIM --------
    function claim() external {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No rewards");

        pendingRewards[msg.sender] = 0;
        require(qie.transfer(msg.sender, amount), "Transfer failed");

        emit RewardClaimed(msg.sender, amount);
    }
}