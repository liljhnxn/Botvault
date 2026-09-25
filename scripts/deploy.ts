import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const targetNetwork = process.env.HARDHAT_NETWORK || "botchain";
  const { ethers } = await network.connect(targetNetwork);
  const currentNetwork = await ethers.provider.getNetwork();
  console.log(`Connecting to network: ${targetNetwork} (Chain ID: ${currentNetwork.chainId})`);

  let deployer;
  if (process.env.PRIVATE_KEY) {
    const rawKey = process.env.PRIVATE_KEY;
    const pk = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    deployer = new ethers.Wallet(pk, ethers.provider);
  } else {
    const signers = await ethers.getSigners();
    if (signers && signers.length > 0) {
      deployer = signers[0];
    } else {
      throw new Error("No deployer signer or PRIVATE_KEY found in .env.local");
    }
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deploying BotVault with deployer: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  const factory = await ethers.getContractFactory("contracts/BotVault.sol:BotVault", deployer);
  const vault = await factory.deploy();
  await vault.waitForDeployment();

  const address = await vault.getAddress();
  const txHash = vault.deploymentTransaction()?.hash;

  console.log("--------------------------------------------------");
  console.log(`✅ BotVault deployed successfully!`);
  console.log(`Contract Address: ${address}`);
  console.log(`Network: Botchain Mainnet (Chain ID: 677)`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Explorer: https://scan.botchain.ai/tx/${txHash}`);
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
