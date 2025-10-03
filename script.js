const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";

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
        alert(connected ? "Wallet connected successfully." : "Wrong wallet. Access denied.");
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
