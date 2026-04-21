import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Donation from "./DonationModel.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Donation DApp backend is running");
});

app.get("/api/campaign", (req, res) => {
  res.json({
    title: "Blockchain Donation Campaign",
    description: "Support our decentralized donation platform.",
    contractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  });
});

app.post("/api/donation", async (req, res) => {
  try {
    const { donorName, amount, walletAddress } = req.body;

    const newDonation = new Donation({
      donorName,
      amount,
      walletAddress,
    });

    await newDonation.save();

    res.json({
      message: "Donation saved successfully",
      donation: newDonation,
    });
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).json({
      message: "Failed to save donation",
    });
  }
});

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      message: "Failed to fetch donations",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});