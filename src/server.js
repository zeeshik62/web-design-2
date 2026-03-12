const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[API] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Server failed to start:", err.message);
  process.exit(1);
});