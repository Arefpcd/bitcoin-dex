const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
let btcAmount = 0;
let btcTxHash = "";
let usdtRecipient = "";

window.addEventListener("load", async () => {
  checkWalletStatus();
  fetchBTCPrice();
});

function checkWalletStatus() {
  const btn = document.getElementById("wallet-connect-btn");
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_accounts" })
      .then(accounts => {
        const connected = accounts[0]?.toLowerCase() === ownerWallet.toLowerCase();
        btn.innerText = connected ? "✅" : "❌";
      })
      .catch(() => {
        btn.innerText = "❌";
      });
  } else {
    btn.innerText = "❌";
  }
}

function manualConnect() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        const connected = accounts[0]?.toLowerCase() === ownerWallet.toLowerCase();
        const btn = document.getElementById("wallet-connect-btn");
        btn.innerText = connected ? "✅" : "❌";
        alert(connected ? "Wallet connected." : "Wrong wallet.");
      })
      .catch(() => {
        alert("Connection failed.");
      });
  } else {
    alert("MetaMask not detected.");
  }
}

function fetchBTCPrice() {
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
  usdtRecipient = document.getElementById("usdt-address").value.trim();
  if (!usdtRecipient || !usdtRecipient.startsWith("0x")) {
    alert("Enter a valid BEP20 USDT wallet address.");
    return;
  }
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("step-4").classList.remove("hidden");
  document.getElementById("usdt-amount").innerText = `${btcAmount * 27000} USDT`;
}
