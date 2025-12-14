function computeTrustScore(token) {
  let score = 100;
  const flags = {};

  // Liquidity lock
  flags.liquidityLocked = token.lockMonths >= 3;
  if (!flags.liquidityLocked) score -= 30;

  // Creator allocation
  flags.lowCreatorShare = (token.creatorAllocationPercent || 0) <= 5;
  if (!flags.lowCreatorShare) score -= 25;

  // Fair launch
  flags.fairLaunch = (token.creatorAllocationPercent || 0) === 0;
  if (!flags.fairLaunch) score -= 15;

  // Safety floor
  score = Math.max(score, 0);

  let level = "RED";
  if (score >= 75) level = "GREEN";
  else if (score >= 45) level = "YELLOW";

  if ((token.validatorEndorsements || []).length >= 3) {
  score += 20;
  flags.validatorBacked = true;
}

  return { score, level, flags };
}

module.exports = { computeTrustScore };