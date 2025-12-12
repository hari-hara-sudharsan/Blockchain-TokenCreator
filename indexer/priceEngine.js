// priceEngine.js - generates simulated OHLC price history
function generateOHLC(seedPrice = 1, points = 50) {
  const data = [];
  let price = seedPrice;

  for (let i = 0; i < points; i++) {
    const open = price;
    const high = open * (1 + Math.random() * 0.15);
    const low = open * (1 - Math.random() * 0.15);
    const close = low + Math.random() * (high - low);
    price = close;

    data.push({
      time: i,
      open,
      high,
      low,
      close
    });
  }

  return data;
}

module.exports = { generateOHLC };