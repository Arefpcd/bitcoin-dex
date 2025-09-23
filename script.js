let btcAmount = 0;
let usdtAmount = 0;
let btcTxHash = "";
let usdtRecipient = "";
const btcWalletAddress = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
const usdtContract = "0x55d398326f99059fF775485246999027B3197955";
const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";

// Connect to MetaMask only if wallet is owner
window.addEventListener("load", async () => {
  const resultBox = document.getElementById("result");
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const connectedWallet = accounts[0].toLowerCase();

      if (connectedWallet !== ownerWallet.toLowerCase()) {
        resultBox.innerHTML = `❌ Unauthorized wallet: <code>${connectedWallet}</code><br>Only the owner wallet can send USDT.`;
        console.warn("Unauthorized wallet:", connectedWallet);
        return;
      }

      resultBox.innerHTML = `✅ Wallet connected: <code>${connectedWallet}</code>`;
      console.log("✅ Authorized wallet connected:", connectedWallet);
    } catch (err) {
      resultBox.innerHTML = `❌ Wallet connection rejected. Please refresh and try again.`;
      console.error("❌ MetaMask connection failed:", err);
    }
  } else {
    resultBox.innerHTML = `❌ MetaMask not detected. Please install it.`;
    alert("MetaMask not detected. Please install it.");
  }
});

// Load live BTC price
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

  document.getElementById("btc-address").textContent = btcWalletAddress;
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
      const decimals = 18;
      btcAmount = rawValue / Math.pow(10, decimals);

      return fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    })
    .then(res => res.json())
    .then(data => {
      const btcPrice = data.bitcoin.usd;
      usdtAmount = btcAmount * btcPrice;

      document.getElementById("step-3").classList.add("hidden");
      document.getElementById("usdt-amount").innerText = usdtAmount.toFixed(2);
      document.getElementById("step-4").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Error verifying transaction or fetching price:", err);
      alert("Error verifying transaction or fetching price.");
    });
}

document.getElementById("confirm-transfer").addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected.");
    return;
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const connectedWallet = accounts[0].toLowerCase();

  if (connectedWallet !== ownerWallet.toLowerCase()) {
    alert("❌ Only the owner wallet can send USDT.");
    return;
  }

  const usdtAmountWei = (usdtAmount * Math.pow(10, 18)).toString();

  const txParams = {
    from: connectedWallet,
    to: usdtContract,
    data: encodeTransfer(usdtRecipient, usdtAmountWei)
  };

  try {
    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams]
    });

    document.getElementById("result").innerHTML =
      `✅ Transfer confirmed.<br>` +
      `Sent <strong>${usdtAmount.toFixed(2)} USDT</strong> to <code>${usdtRecipient}</code><br>` +
      `TXID: <code>${txHash}</code>`;
  } catch (err) {
    console.error("Transfer failed:", err);
    alert("Transfer failed or rejected.");
  }
});

function encodeTransfer(to, amount) {
  const methodId = "a9059cbb"; // transfer(address,uint256)
  const paddedTo = to.replace("0x", "").padStart(64, "0");
  const paddedAmount = BigInt(amount).toString(16).padStart(64, "0");
  return "0x" + methodId + paddedTo + paddedAmount;
}
