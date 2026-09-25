import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const targetNetwork = process.env.HARDHAT_NETWORK || "botchain";
  const { ethers } = await network.connect(targetNetwork);
  const address = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS || "0x555e35a9dF9adFe84353e9FC018f46060Dcd8144";
  
  console.log(`Connecting to Botchain Mainnet (Chain ID 677)...`);
  console.log(`Checking contract at address: ${address}`);

  const code = await ethers.provider.getCode(address);
  if (code === "0x" || code === "") {
    console.error("❌ No bytecode found at address! Contract is not deployed at this address.");
    process.exit(1);
  }

  console.log(`✅ Bytecode verified on-chain (${code.length / 2 - 1} bytes).`);

  const vault = await ethers.getContractAt("contracts/BotVault.sol:BotVault", address);
  const count = await vault.getVaultCount();
  console.log(`✅ getVaultCount() query succeeded: ${count.toString()} vaults created.`);

  console.log("--------------------------------------------------");
  console.log("🎉 Real on-chain contract verification successful!");
  console.log("--------------------------------------------------");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
