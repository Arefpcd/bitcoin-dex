// Fetch live BTC price and display it
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
  .then(res => res.json())
  .then(data => {
    let btcPrice = data.bitcoin.usd;
    document.getElementById("btc-price").innerText = `$${btcPrice}`;
  });

// Handle exchange submission
function convertBTC() {
  let btcAmount = parseFloat(document.getElementById("btc-amount").value);
  let userWallet = document.getElementById("user-wallet").value.trim();

  if (!btcAmount || btcAmount <= 0) {
    document.getElementById("result").innerText = "❌ Enter a valid BTC amount.";
    return;
  }

  if (!userWallet) {
    document.getElementById("result").innerText = "❌ Enter your USDT wallet address.";
    return;
  }

  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      let btcPrice = data.bitcoin.usd;
      let usdtValue = btcAmount * btcPrice;

      let depositAddress = "YOUR_BTC_DEPOSIT_ADDRESS_HERE"; // Replace with your BTC wallet

      document.getElementById("result").innerHTML =
        `✅ Please send <strong>${btcAmount} BTC</strong> to:<br>` +
        `<code>${depositAddress}</code><br><br>` +
        `Once confirmed, <strong>${usdtValue.toFixed(2)} USDT</strong> will be sent to:<br>` +
        `<code>${userWallet}</code>`;
    })
    .catch(error => {
      console.error("Error fetching BTC price:", error);
      document.getElementById("result").innerText = "❌ Failed to fetch BTC price.";
    });
}
