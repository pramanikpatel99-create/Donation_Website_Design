import mongoose from "mongoose"; // Import Mongoose

// Create schema for donation records
const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String, // Donor name
      required: true, // Required field
    },
    mobileNumber: {
      type: String, // Donor mobile number
      required: true, // Required field
    },
    address: {
      type: String, // Donor address
      required: true, // Required field
    },
    message: {
      type: String, // Optional donor message
      default: "", // Default blank
    },
    amount: {
      type: String, // Donation amount
      required: true, // Required field
    },
    walletAddress: {
      type: String, // MetaMask wallet address
      required: true, // Required field
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Export model
export default mongoose.model("Donation", donationSchema);