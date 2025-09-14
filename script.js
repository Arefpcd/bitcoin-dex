function submitExchange() {
  const btcAmount = parseFloat(document.getElementById("btc-amount").value);
  const usdtAddress = document.getElementById("usdt-address").value.trim();
  const btcTxid = document.getElementById("btc-txid").value.trim();
  const resultBox = document.getElementById("result");

  if (!btcAmount || btcAmount <= 0) {
    resultBox.innerText = "❌ Enter a valid BTC amount.";
    return;
  }

  if (!usdtAddress || !usdtAddress.startsWith("0x")) {
    resultBox.innerText = "❌ Enter a valid USDT wallet address (BEP20).";
    return;
  }

  if (!btcTxid || btcTxid.length < 20) {
    resultBox.innerText = "❌ Enter a valid BTC transaction hash.";
    return;
  }

  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      const btcPrice = data.bitcoin.usd;
      const usdtValue = btcAmount * btcPrice;

      resultBox.innerHTML =
        `✅ BTC transaction received.<br>` +
        `Amount: <strong>${btcAmount} BTC</strong><br>` +
        `Estimated USDT: <strong>${usdtValue.toFixed(2)} USDT</strong><br><br>` +
        `🔄 Sending USDT to <code>${usdtAddress}</code> on Binance Smart Chain...`;

      // Simulated auto-transfer (replace with real API call to wallet backend)
      setTimeout(() => {
        resultBox.innerHTML += `<br><br>✅ Transfer complete. TXID: <code>0xFAKEUSDTTXID</code>`;
      }, 3000);
    })
    .catch(err => {
      console.error(err);
      resultBox.innerText = "❌ Failed to fetch BTC price.";
    });
}
