export default function ValidatorPanel({ token }) {
  const count = token.validatorEndorsements?.length || 0;

  return (
    <div className="card mt-4">
      <h4>🛡 Validator Security</h4>

      <div className="row-between">
        <span>Validators backing</span>
        <strong>{count}</strong>
      </div>

      {count >= 3 ? (
        <div className="trust-green mt-2">✔ Validator Secured</div>
      ) : (
        <div className="trust-yellow mt-2">⚠ Awaiting validators</div>
      )}
    </div>
  );
}