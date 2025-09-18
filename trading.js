// trading.js
// Called after api.js is loaded (relies on window.PTH_API)

let chart = null;
let candleSeries = null;

function el(id){ return document.getElementById(id); }

async function initPage() {
  // Logout button
  el('logoutBtn').addEventListener('click', async () => {
    await firebase.auth().signOut();
    window.location = '/index.html'; // put your login page
  });

  // Load signals
  await loadSignals();

  // Chart initial load
  el('loadChartBtn').addEventListener('click', () => {
    const symbol = el('symbolInput').value.trim() || 'BTCUSDT';
    const range = el('rangeSelect').value;
    loadChart(symbol, range);
  });

  // auto load default chart
  loadChart(el('symbolInput').value || 'BTCUSDT', el('rangeSelect').value || '1h');

  // Optionally poll signals every 15s
  setInterval(loadSignals, 15000);
}

// Fetch and render signals
async function loadSignals() {
  const list = el('signalsList');
  list.innerHTML = 'Loading signals…';
  try {
    const data = await PTH_API.fetch('/api/signals'); // expects array
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = '<div class="muted">No signals right now</div>';
      return;
    }

    list.innerHTML = '';
    data.forEach(sig => {
      // expected sig keys: id, symbol, side, price, target, stoploss, timeframe, timestamp
      const node = document.createElement('div');
      node.className = 'signal-card';
      node.innerHTML = `
        <div class="signal-top">
          <strong>${sig.symbol}</strong>
          <span class="pill ${sig.side === 'BUY' ? 'buy' : 'sell'}">${sig.side}</span>
        </div>
        <div class="signal-body">
          <div>Price: ${sig.price}</div>
          <div>Target: ${sig.target} • SL: ${sig.stoploss}</div>
          <div class="muted">${sig.timeframe} • ${new Date(sig.timestamp).toLocaleString()}</div>
        </div>
      `;
      node.addEventListener('click', () => {
        el('symbolInput').value = sig.symbol;
        loadChart(sig.symbol, sig.timeframe || '1h');
      });
      list.appendChild(node);
    });
  } catch (err) {
    console.error('loadSignals err', err);
    list.innerHTML = `<div class="error">Failed to load signals: ${err.message}</div>`;
  }
}

// Load OHLC data and draw chart
async function loadChart(symbol = 'BTCUSDT', range = '1h') {
  try {
    if (!chart) {
      chart = LightweightCharts.createChart(document.getElementById('chart'), {
        layout: { textColor: '#d1d1d1', background: { type: 'solid', color: '#0f1720' } },
        grid: { vertLines: { visible: false }, horzLines: { color: '#333' } },
        rightPriceScale: { visible: true },
        timeScale: { timeVisible: true, rightOffset: 5 }
      });
      candleSeries = chart.addCandlestickSeries();
    }

    // Fetch OHLC from backend. Adjust query params to match your backend implementation.
    const q = `/api/chart?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(range)}&limit=500`;
    const ohlc = await PTH_API.fetch(q);

    // Convert backend OHLC to lightweight-charts format
    // Accept backend format: [{time:'2025-09-18T12:00:00Z', open:.., high:.., low:.., close:..}, ...]
    const series = ohlc.map(item => {
      let t = item.time;
      // convert ISO to unix seconds if your backend returns ISO
      if (typeof t === 'string' && t.includes('T')) {
        t = Math.floor(new Date(t).getTime() / 1000);
      }
      return {
        time: t,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close)
      };
    });

    candleSeries.setData(series);
    // auto fit
    chart.timeScale().fitContent();
  } catch (err) {
    console.error('loadChart err', err);
    document.getElementById('chart').innerHTML = `<div class="error">Chart error: ${err.message}</div>`;
  }
}

// On page ready ensure user is logged in, otherwise redirect to login
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location = '/index.html';
    return;
  }
  // start page
  initPage().catch(e => console.error(e));
});
