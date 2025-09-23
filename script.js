let btcAmount = 0;
let usdtAmount = 0;
let btcTxHash = "";
let usdtRecipient = "";
const btcWalletAddress = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
const usdtContract = "0x55d398326f99059fF775485246999027B3197955";
const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";

window.addEventListener("load", async () => {
  const walletStatus = document.getElementById("wallet-status");
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const connectedWallet = accounts[0].toLowerCase();
      walletStatus.innerText = connectedWallet === ownerWallet.toLowerCase() ? "✅" : "❌";
    } catch {
      walletStatus.innerText = "❌";
    }
  } else {
    walletStatus.innerText = "❌";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(data => {
      const btcPrice = data?.bitcoin?.usd;
      if (!btcPrice) throw new Error("Price missing");
      document.getElementById("btc-price").innerText = `$${btcPrice.toLocaleString()}`;
    })
    .catch(() => {
      document.getElementById("btc-price").innerText = "❌ Price unavailable";
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
  btcTxHash = document.getElementById("btc-txid").value.trim();
  if (!btcTxHash || btcTxHash.length < 20) {
    alert("Enter a valid BSC transaction hash.");
    return;
  }
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.remove("hidden");
}

function finalStep() {
  usdtRecipient = document.getElementById("usdt-address").value.trim();
  if (!usdtRecipient || !usdtRecipient.startsWith("0x")) {
    alert("Enter a valid BEP20 USDT wallet address.");
    return;
  }

  fetch(`https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${btcTxHash}&apikey=YourApiKey`)
    .then(res => res.json())
    .then(txData => {
      if (!txData.result || txData.result.to.toLowerCase() !== btcWalletAddress.toLowerCase()) {
        alert("Transaction not found or not sent to your BTC wallet address.");
        return;
      }

      const rawValue = parseInt(txData.result.value, 16);
      btcAmount = rawValue / Math.pow(10, 18);

      return fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    })
    .then(res => res.json())
    .then(data => {
      const
