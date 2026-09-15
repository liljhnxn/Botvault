import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const rpcUrl = process.env.BOTCHAIN_RPC_URL || process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life";
const privateKey = process.env.PRIVATE_KEY;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: "0.8.24",
  networks: {
    hardhatMainnet: { type: "edr-simulated", chainType: "l1" },
    botchain: {
      type: "http",
      chainType: "l1",
      url: rpcUrl,
      accounts: privateKey ? [privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`] : [],
    },
  },
});
