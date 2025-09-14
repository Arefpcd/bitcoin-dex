let btcAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      const btcPrice = data.bitcoin.usd;
      document.getElementById("btc-price").innerText = `$${btcPrice.toLocaleString()}`;
    })
    .catch(err => {
      console.error("Error fetching BTC price:", err);
      document.getElementById("btc-price").innerText = "❌ Error loading price";
    });
});

function nextStep1() {
  btcAmount = parseFloat(document.getElementById("btc-amount").value);
  if (!btcAmount || btcAmount <= 0) {
    alert("Enter a valid BTC amount.");
    return;
  }
  document.getElementById("step-1").classList.add("hidden");
  document.getElementById("step-2").classList.remove("hidden");
}

function nextStep2() {
  const txid = document.getElementById("btc-txid").value.trim();
  if (!txid || txid.length < 20) {
    alert("Enter a valid BTC transaction hash.");
    return;
  }
  // Simulate verification (replace with real API call to verify txid)
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.remove("hidden");
}

function finalStep() {
  const usdtAddress = document.getElementById("usdt-address").value.trim();
  if (!usdtAddress || !usdtAddress.startsWith("0x")) {
    alert("Enter a valid BEP20 USDT wallet address.");
    return;
  }

  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      const btcPrice = data.bitcoin.usd;
      const usdtAmount = btcAmount * btcPrice;

      document.getElementById("result").innerHTML =
        `✅ Transaction verified.<br>` +
        `You sent <strong>${btcAmount} BTC</strong><br>` +
        `Current BTC price: <strong>$${btcPrice}</strong><br>` +
        `USDT to be sent: <strong>${usdtAmount.toFixed(2)} USDT</strong><br><br>` +
        `🔄 Sending USDT to <code>${usdtAddress}</code> on Binance Smart Chain...`;

      // Simulate transfer
      setTimeout(() => {
        document.getElementById("result").innerHTML += `<br><br>✅ Transfer complete. TXID: <code>0xFAKEUSDTTXID</code>`;
      }, 3000);
    });
}
