import { defineConfig } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

const networks: Record<string, any> = {
  localhost: {
    type: "http",
    url: "http://127.0.0.1:8545",
  },
};

if (sepoliaRpcUrl && privateKey) {
  networks.sepolia = {
    type: "http",
    url: sepoliaRpcUrl,
    accounts: [privateKey],
  };
}

export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: "0.8.28",
  networks,
});