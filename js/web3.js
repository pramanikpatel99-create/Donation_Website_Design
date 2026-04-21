const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_donorName",
        type: "string",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

let provider;
let signer;
let contract;

window.addEventListener("DOMContentLoaded", () => {
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const donateBtn = document.getElementById("donateBtn");
  const walletAddress = document.getElementById("walletAddress");
  const transactionStatus = document.getElementById("transactionStatus");

  async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed or not available in this preview page.");
      return;
    }

    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);

      const address = await signer.getAddress();
      walletAddress.textContent = `Connected: ${address}`;
      transactionStatus.textContent = "Wallet connected successfully";
    } catch (error) {
      console.error("Wallet connection error:", error);
      transactionStatus.textContent = "Wallet connection failed";
    }
  }

  async function donate() {
  if (!contract) {
    transactionStatus.textContent = "Please connect wallet first";
    return;
  }

  try {
    transactionStatus.textContent = "Transaction pending...";

    const tx = await contract.donate("Sunny", {
      value: ethers.parseEther("0.01"),
    });

    await tx.wait();

    const address = await signer.getAddress();

    await fetch("https://turbo-trout-x574xqrv474gc5g4-5000.app.github.dev/api/donation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        donorName: "Sunny",
        amount: "0.01 ETH",
        walletAddress: address
      })
    });

    transactionStatus.textContent = "Donation successful and backend updated";
  } catch (error) {
    console.error("Donation error:", error);
    transactionStatus.textContent = "Donation failed";
  }
}

  connectWalletBtn.addEventListener("click", connectWallet);
  donateBtn.addEventListener("click", donate);
});