// public/workers/compareWorker.js
self.onmessage = function(e) {
  const { tokens } = e.data;
  // simple heavy work example: compute volatility score for each token
  function computeVolatility(history) {
    if (!history || history.length < 2) return 0;
    const returns = [];
    for (let i=1;i<history.length;i++){
      returns.push((history[i].c - history[i-1].c)/history[i-1].c);
    }
    const mean = returns.reduce((a,b)=>a+b,0)/returns.length || 0;
    const variance = returns.reduce((a,b)=>a + Math.pow(b-mean,2),0)/returns.length || 0;
    return Math.sqrt(variance);
  }
  const out = tokens.map(t => ({
    tokenAddress: t.tokenAddress,
    volatility: computeVolatility(t.priceHistory)
  }));
  postMessage({ result: out });
};