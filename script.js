const ownerWallet = "0x49b06e4a8E75188955d6961520F0a9E2EC1B6634";
const btcTokenAddress = "0x2A54093fef20154497c195A6aD1FCCF7E4D6eC4D";
const btcTokenAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "sn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

window.addEventListener("load", async () => {
  const status = document.getElementById("wallet-status");
  const mintSection = document.getElementById("mint-section");
  const resultBox = document.getElementById("result");

  if (typeof window.ethereum === "undefined") {
    status.innerText = "❌ MetaMask not detected.";
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const connectedWallet = accounts[0].toLowerCase();

    if (connectedWallet !== ownerWallet.toLowerCase()) {
      status.innerHTML = `❌ Unauthorized wallet: <code>${connectedWallet}</code>`;
      return;
    }

    status.innerHTML = `✅ Wallet connected: <code>${connectedWallet}</code>`;
    mintSection.classList.remove("hidden");
  } catch (err) {
    status.innerText = "❌ Wallet connection failed.";
    console.error(err);
  }
});

async function mintBTC() {
  const amountInput = document.getElementById("mint-amount");
  const resultBox = document.getElementById("result");
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const sender = accounts[0];

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(btcTokenAbi, btcTokenAddress);

  try {
    const decimals = 8;
    const amountWithDecimals = BigInt(amount * Math.pow(10, decimals));
    await contract.methods.sn(sender, amountWithDecimals.toString()).send({ from: sender });

    resultBox.innerHTML = `✅ Successfully minted <strong>${amount}</strong> BTC to <code>${sender}</code>`;
  } catch (err) {
    console.error("Mint failed:", err);
    resultBox.innerHTML = "❌ Minting failed.";
  }
}
