import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();

  const donation = await viem.deployContract("Donation");

  console.log("Donation contract deployed to:", donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});