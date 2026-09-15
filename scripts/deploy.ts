import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const { ethers } = await network.connect();
  const signers = await ethers.getSigners();
  
  let deployer;
  if (signers && signers.length > 0) {
    deployer = signers[0];
  } else if (process.env.PRIVATE_KEY) {
    const rawKey = process.env.PRIVATE_KEY;
    const pk = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    deployer = new ethers.Wallet(pk, ethers.provider);
  } else {
    throw new Error("No deployer signer or PRIVATE_KEY found in .env.local");
  }

  console.log(`Deploying BotVault with deployer: ${await deployer.getAddress()}...`);
  const factory = await ethers.getContractFactory("BotVault", deployer);
  const vault = await factory.deploy();
  await vault.waitForDeployment();

  const address = await vault.getAddress();
  const txHash = vault.deploymentTransaction()?.hash;

  console.log("--------------------------------------------------");
  console.log(`✅ BotVault deployed successfully!`);
  console.log(`Contract Address: ${address}`);
  console.log(`Network: Botchain Testnet (Chain ID: 968)`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
  }
  console.log("--------------------------------------------------");
  console.log(`Add this to your .env.local:`);
  console.log(`NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS=${address}`);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
