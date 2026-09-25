async function check() {
  const address = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS || "0x555e35a9dF9adFe84353e9FC018f46060Dcd8144";
  const url = `https://scan.botchain.ai/api?module=contract&action=getsourcecode&address=${address}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Source code API result:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Check error:", e);
  }
}

check();
