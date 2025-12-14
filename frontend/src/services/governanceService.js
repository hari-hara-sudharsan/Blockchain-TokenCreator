let proposals = [
  {
    id: 1,
    title: "Increase LP lock to 12 months",
    description: "Improve rug protection and trust score",
    yes: 12,
    no: 2,
  },
  {
    id: 2,
    title: "Enable auto LP burn",
    description: "Burn 50% LP after unlock",
    yes: 8,
    no: 1,
  },
]

export function getProposals() {
  return proposals
}

export function vote(proposalId, support) {
  proposals = proposals.map((p) =>
    p.id === proposalId
      ? {
          ...p,
          yes: support ? p.yes + 1 : p.yes,
          no: !support ? p.no + 1 : p.no,
        }
      : p
  )
}