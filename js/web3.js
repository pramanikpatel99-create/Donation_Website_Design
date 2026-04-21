const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

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

document.addEventListener("DOMContentLoaded", function () {
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const donateBtn = document.getElementById("donateBtn");
  const walletAddress = document.getElementById("walletAddress");
  const transactionStatus = document.getElementById("transactionStatus");

  async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed.");
      transactionStatus.textContent = "MetaMask is not installed";
      transactionStatus.style.color = "red";
      return;
    }

    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);

      const address = await signer.getAddress();
      walletAddress.textContent = `Connected: ${address}`;
      walletAddress.style.color = "green";

      transactionStatus.textContent = "Wallet connected successfully";
      transactionStatus.style.color = "green";
    } catch (error) {
      console.error("Wallet connection error:", error);
      transactionStatus.textContent = "Wallet connection failed";
      transactionStatus.style.color = "red";
    }
  }

  async function donate() {
    if (!contract) {
      transactionStatus.textContent = "Please connect wallet first";
      transactionStatus.style.color = "orange";
      return;
    }

    const donorName = document.getElementById("donorName").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const addressField = document.getElementById("address").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!donorName || !mobileNumber || !addressField) {
      transactionStatus.textContent = "Please fill name, mobile, and address first";
      transactionStatus.style.color = "red";
      return;
    }

    try {
      transactionStatus.textContent = "Transaction pending...";
      transactionStatus.style.color = "blue";

      const tx = await contract.donate(donorName, {
        value: ethers.parseEther("0.01"),
      });

      await tx.wait();

      const connectedWallet = await signer.getAddress();

      const response = await fetch("http://127.0.0.1:5000/api/donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorName,
          mobileNumber,
          address: addressField,
          message,
          amount: "0.01 ETH",
          walletAddress: connectedWallet,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend save failed");
      }

      transactionStatus.textContent = "Donation successful and backend updated";
      transactionStatus.style.color = "green";
    } catch (error) {
      console.error("Donation error:", error);
      transactionStatus.textContent = "Donation failed";
      transactionStatus.style.color = "red";
    }
  }

  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", connectWallet);
  }

  if (donateBtn) {
    donateBtn.addEventListener("click", donate);
  }
});