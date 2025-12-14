export default function ProposalCard({ proposal, onVote }) {
  return (
    <div
      style={{
        background: "#020617",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
      }}
    >
      <h3>{proposal.title}</h3>
      <p style={{ opacity: 0.7 }}>{proposal.description}</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={() => onVote(proposal.id, true)}>
          👍 Yes ({proposal.yes})
        </button>
        <button onClick={() => onVote(proposal.id, false)}>
          👎 No ({proposal.no})
        </button>
      </div>
    </div>
  )
}