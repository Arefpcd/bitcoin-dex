let liquidityUSDT = 3.00;

fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
  .then(res => res.json())
  .then(data => {
    let btcPrice = data.bitcoin.usd;
    document.getElementById("btc-price").innerText = `$${btcPrice}`;
  });

function convertBTC() {
  let btcAmount = parseFloat(document.getElementById("btc-amount").value);
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      let btcPrice = data.bitcoin.usd;
      let usdtValue = btcAmount * btcPrice;
      if (usdtValue > liquidityUSDT) {
        document.getElementById("result").innerText = "❌ Not enough liquidity!";
      } else {
        document.getElementById("result").innerText = `✅ You receive ${usdtValue.toFixed(2)} USDT`;
        liquidityUSDT -= usdtValue;
        document.getElementById("liquidity").innerText = liquidityUSDT.toFixed(2);
      }
    });
}
