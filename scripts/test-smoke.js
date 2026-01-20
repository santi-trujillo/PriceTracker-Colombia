const http = require("http");

const PORT = process.env.PORT || 3000;
const HOSTNAME = "localhost";

console.log("Running Smoke Tests...");

const runTest = (path, expectedStatus, testName) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOSTNAME,
      port: PORT,
      path: path,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode === expectedStatus) {
          console.log(`✅ ${testName} - PASSED (${res.statusCode})`);
          resolve();
        } else {
          console.error(
            `❌ ${testName} - FAILED (Expected ${expectedStatus}, got ${res.statusCode})`,
          );
          reject(new Error(`Status mismatch: ${res.statusCode}`));
        }
      });
    });

    req.on("error", (e) => {
      console.error(`❌ ${testName} - ERROR: ${e.message}`);
      reject(e);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
};

const runAllTests = async () => {
  try {
    await runTest("/health", 200, "Health Check");
    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Tests failed:", error.message);
    process.exit(1);
  }
};

runAllTests();
