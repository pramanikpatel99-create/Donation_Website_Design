import express from "express"; // Import Express framework
import cors from "cors"; // Import CORS middleware
import mongoose from "mongoose"; // Import Mongoose for MongoDB
import dotenv from "dotenv"; // Import dotenv to read .env values
import Donation from "./DonationModel.js"; // Import donation model

dotenv.config(); // Load .env variables

const app = express(); // Create Express app
const PORT = 5000; // Backend port

app.use(cors()); // Allow frontend to connect to backend
app.use(express.json()); // Allow JSON request body

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully"); // Show success if DB connects
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error); // Show DB error if connection fails
  });

// Save donation data
app.post("/api/donation", async (req, res) => {
  try {
    // Get data sent from frontend
    const { donorName, mobileNumber, address, message, amount, walletAddress } = req.body;

    // Create new donation document
    const newDonation = new Donation({
      donorName,
      mobileNumber,
      address,
      message,
      amount,
      walletAddress,
    });

    // Save to MongoDB
    await newDonation.save();

    // Send success response
    res.status(200).json({
      message: "Donation saved successfully",
      donation: newDonation,
    });
  } catch (error) {
    // Send error response if save fails
    console.error("Error saving donation:", error);
    res.status(500).json({
      message: "Failed to save donation",
      error: error.message,
    });
  }
});

// Fetch all donations
app.get("/api/donations", async (req, res) => {
  try {
    // Get all donations, newest first
    const donations = await Donation.find().sort({ createdAt: -1 });

    // Send data back
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

// Start backend server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});