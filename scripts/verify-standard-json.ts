import * as fs from "fs";
import * as path from "path";

async function main() {
  const contractAddress = "0x2bbe69cD810543FC2b819081172D74c66D44556C";
  const buildInfoFile = "solc-0_8_24-2d1fdd1d1a974306a78bb8f3a40d4d2ea704a5de.json";
  const buildInfoPath = path.join(process.cwd(), "artifacts", "build-info", buildInfoFile);

  if (!fs.existsSync(buildInfoPath)) {
    console.error("Build info file not found");
    return;
  }

  const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf-8"));
  const standardJson = JSON.stringify(buildInfo.input);

  console.log("Submitting Standard JSON Input verification to https://scan.botchain.ai/api...");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", standardJson);
  params.append("codeformat", "solidity-standard-json-input");
  params.append("contractname", "contracts/BotVault.sol:BotVault");
  params.append("compilerversion", "v0.8.24+commit.e11b9ed9");

  const res = await fetch("https://scan.botchain.ai/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const text = await res.text();
  console.log("Verification response:", text);

  try {
    const json = JSON.parse(text);
    if (json.result) {
      const guid = json.result;
      console.log("GUID:", guid);

      for (let i = 0; i < 6; i++) {
        await new Promise((r) => setTimeout(r, 4000));
        const check = await fetch(`https://scan.botchain.ai/api?module=contract&action=checkverifystatus&guid=${guid}`);
        const checkData = await check.json();
        console.log(`Check ${i + 1}:`, checkData);
        if (checkData.result === "Pass - Verified" || (checkData.message === "OK" && checkData.result?.includes?.("Verified"))) {
          console.log("🎉 SUCCESS: Verified on Botchain Explorer!");
          break;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
