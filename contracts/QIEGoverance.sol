// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IValidatorHub {
    function validators(address) external view returns (uint256 stake, bool active);
}

contract QIEGovernance {
    struct Proposal {
        address token;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;

    IValidatorHub public validatorHub;

    event ProposalCreated(uint256 id, address token);
    event Voted(uint256 id, address voter, bool support);
    event ProposalExecuted(uint256 id, bool slashed);

    constructor(address _validatorHub) {
        validatorHub = IValidatorHub(_validatorHub);
    }

    function propose(address token) external returns (uint256) {
        (, bool active) = validatorHub.validators(msg.sender);
        require(active, "Not a validator");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            token: token,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + 2 days,
            executed: false
        });

        emit ProposalCreated(proposalCount, token);
        return proposalCount;
    }

    function vote(uint256 id, bool support) external {
        (, bool active) = validatorHub.validators(msg.sender);
        require(active, "Not validator");
        require(!voted[id][msg.sender], "Already voted");
        require(block.timestamp < proposals[id].deadline, "Ended");

        voted[id][msg.sender] = true;

        if (support) proposals[id].votesFor++;
        else proposals[id].votesAgainst++;

        emit Voted(id, msg.sender, support);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp >= p.deadline, "Too early");
        require(!p.executed, "Executed");

        p.executed = true;
        bool slashed = p.votesAgainst > p.votesFor;

        emit ProposalExecuted(id, slashed);
    }
}