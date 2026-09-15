async function check() {
  const address = "0x2bbe69cD810543FC2b819081172D74c66D44556C";
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
