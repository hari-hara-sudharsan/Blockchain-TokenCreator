// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Governance {
    struct Proposal {
        address target;
        bytes data;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event Proposed(uint256 id, address target);
    event Voted(uint256 id, bool support);
    event Executed(uint256 id);

    function propose(address target, bytes calldata data) external {
        proposals[++proposalCount] = Proposal({
            target: target,
            data: data,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        });

        emit Proposed(proposalCount, target);
    }

    function vote(uint256 id, bool support) external {
        if (support) {
            proposals[id].votesFor++;
        } else {
            proposals[id].votesAgainst++;
        }

        emit Voted(id, support);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(!p.executed, "Executed");
        require(p.votesFor > p.votesAgainst, "Rejected");

        (bool ok, ) = p.target.call(p.data);
        require(ok, "Call failed");

        p.executed = true;
        emit Executed(id);
    }
}
