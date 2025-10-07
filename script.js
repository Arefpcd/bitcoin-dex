const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
let btcAmount = 0;
let btcTxHash = "";
let usdtRecipient = "";
let usdtAmount = 0;

window.addEventListener("load", () => {
  checkWalletStatus();
  fetchBTCPrice();
});

function checkWalletStatus() {
  const btn = document.getElementById("wallet-status-btn");
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
        const btn = document.getElementById("wallet-status-btn");
        btn.innerText = connected ? "✅" : "❌";
        alert(connected ? "Wallet connected successfully." : "Access denied.");
      })
      .catch(() => {
        alert("Connection failed.");
      });
  } else {
    alert("MetaMask not detected.");
  }
}

function fetchBTCPrice() {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usdt")
    .then(response => response.json())
    .then(data => {
      const btcPrice = data?.bitcoin?.usdt;
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
  const input = document.getElementById("btc-amount");
  btcAmount = parseFloat(input.value);
  if (!btcAmount || btcAmount <= 0) {
    alert("Enter a valid BTC amount.");
    return;
  }
  document.getElementById("step-1").classList.add("hidden");
  document.getElementById("step-2").classList.remove("hidden");
}

function nextStep2() {
  const input = document.getElementById("btc-txid");
  btcTxHash = input.value.trim();
  if (!btcTxHash || btcTxHash.length < 20) {
    alert("Enter a valid transaction hash.");
    return;
  }
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.remove("hidden");
}

function finalStep() {
  const input = document.getElementById("usdt-address");
  usdtRecipient = input.value.trim();
  if (!usdtRecipient || !usdtRecipient.startsWith("0x")) {
    alert("Enter a valid USDT address.");
    return;
  }
  usdtAmount = btcAmount * 27000;
  document.getElementById("usdt-amount").innerText = `${usdtAmount.toFixed(2)} USDT`;
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("step-4").classList.remove("hidden");
}

async function sendUSDT() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected.");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const sender = accounts[0]?.toLowerCase();

  if (sender !== ownerWallet.toLowerCase()) {
    alert("Access denied. Only owner wallet can send USDT.");
    return;
  }

  const usdtContractAddress = "0x55d398326f99059fF775485246999027B3197955";
  const us
