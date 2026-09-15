import * as fs from "fs";
import * as path from "path";

async function verifyOnBohr() {
  const contractAddress = "0x2bbe69cD810543FC2b819081172D74c66D44556C";
  const sourceCode = fs.readFileSync(path.join(process.cwd(), "contracts", "BotVault_Flattened.sol"), "utf-8");

  console.log("Sending verification request directly to https://scan.bohr.life/api...");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", sourceCode);
  params.append("codeformat", "solidity-single-file");
  params.append("contractname", "BotVault");
  params.append("compilerversion", "v0.8.24+commit.e11b9ed9");
  params.append("optimizationUsed", "0");
  params.append("runs", "200");
  params.append("evmversion", "shanghai");
  params.append("licenseType", "3");

  const res = await fetch("https://scan.bohr.life/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const body = await res.text();
  console.log("Response from scan.bohr.life:", body);
}

verifyOnBohr().catch(console.error);
