export default function LaunchWarnings({ token }) {
  const flags = token?.trust?.flags;
  if (!flags) return null;

  const warnings = [];

  if (!flags.liquidityLocked)
    warnings.push("Liquidity not locked sufficiently");

  if (!flags.lowCreatorShare)
    warnings.push("High creator allocation detected");

  if (!flags.fairLaunch)
    warnings.push("Not a fair launch");

  if (warnings.length === 0) return null;

  return (
    <div className="warning-box">
      <strong>⚠ Risk Warnings</strong>
      <ul>
        {warnings.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  );
}