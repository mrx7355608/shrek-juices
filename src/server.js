import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./utils/dbConnections.js";

async function startApp() {
  await connectDatabase(process.env.DB_URL);
  app.listen(5000, "0.0.0.0", () => {
    console.log("express started on port 5000");
  });
}

startApp();
