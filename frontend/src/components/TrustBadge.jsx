export default function TrustBadge({ trust }) {
  const color =
    trust?.level === "green"
      ? "green"
      : trust?.level === "yellow"
      ? "yellow"
      : "red"

  return <span className={`trust ${color}`}>{color.toUpperCase()}</span>
}