// workers/priceWorker.js
self.onmessage = function(e) {
  const { seed = "", points = 50 } = e.data;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const arr = [];
  let value = (h % 100) + 20;
  for (let i = 0; i < points; i++) {
    const change = ((h >> (i % 16)) % 9) - 4;
    value = Math.max(1, Math.round(value * (1 + change / 100)));
    arr.push(value);
  }
  postMessage({ priceData: arr });
};
