export default function MasterBuilderCard({ token }) {
  return (
    <div className="card master-builder">
      <h3>🧠 QIEDEX Master Builder</h3>

      <div className="row">
        <span>Trust Score</span>
        <strong>{token.trust.score}/100</strong>
      </div>

      <div className="row">
        <span>Liquidity Locked</span>
        <strong>{token.trust.flags.liquidityLocked ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>Creator Allocation</span>
        <strong>{token.creatorAllocationPercent || 0}%</strong>
      </div>

      <div className="row">
        <span>Launch Type</span>
        <strong>
          {token.trust.flags.fairLaunch ? "Fair Launch" : "Restricted"}
        </strong>
      </div>
    </div>
  );
}