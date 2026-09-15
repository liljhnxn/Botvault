import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const { ethers } = await network.connect();
  const address = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS || "0x2bbe69cD810543FC2b819081172D74c66D44556C";
  
  console.log(`Connecting to Botchain Testnet (Chain ID 968)...`);
  console.log(`Checking contract at address: ${address}`);

  const code = await ethers.provider.getCode(address);
  if (code === "0x" || code === "") {
    console.error("❌ No bytecode found at address! Contract is not deployed at this address.");
    process.exit(1);
  }

  console.log(`✅ Bytecode verified on-chain (${code.length / 2 - 1} bytes).`);

  const vault = await ethers.getContractAt("BotVault", address);
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
