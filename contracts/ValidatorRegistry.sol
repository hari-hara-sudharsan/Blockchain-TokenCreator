// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ValidatorRegistry {
    IERC20 public immutable qie;

    uint256 public constant MIN_STAKE = 10_000 ether;
    uint256 public constant SLASH_PERCENT = 30;

    struct Validator {
        uint256 stake;
        bool active;
        uint256 joinedAt;
    }

    mapping(address => Validator) public validators;
    address[] public validatorList;

    event ValidatorJoined(address indexed validator, uint256 stake);
    event ValidatorSlashed(address indexed validator, uint256 amount);
    event ValidatorExited(address indexed validator);

    constructor(address _qie) {
        qie = IERC20(_qie);
    }

    // -------- JOIN --------
    function joinValidator(uint256 amount) external {
        require(amount >= MIN_STAKE, "Insufficient stake");
        require(!validators[msg.sender].active, "Already validator");

        qie.transferFrom(msg.sender, address(this), amount);

        validators[msg.sender] = Validator({
            stake: amount,
            active: true,
            joinedAt: block.timestamp
        });

        validatorList.push(msg.sender);
        emit ValidatorJoined(msg.sender, amount);
    }

    // -------- SLASH --------
    function slash(address validator) external {
        Validator storage v = validators[validator];
        require(v.active, "Not active");

        uint256 slashAmount = (v.stake * SLASH_PERCENT) / 100;
        v.stake -= slashAmount;

        emit ValidatorSlashed(validator, slashAmount);
    }

    // -------- EXIT --------
    function exitValidator() external {
        Validator memory v = validators[msg.sender];
        require(v.active, "Not validator");

        validators[msg.sender].active = false;
        qie.transfer(msg.sender, v.stake);

        emit ValidatorExited(msg.sender);
    }

    function isValidator(address user) external view returns (bool) {
        return validators[user].active;
    }

    function totalValidators() external view returns (uint256) {
        return validatorList.length;
    }
}