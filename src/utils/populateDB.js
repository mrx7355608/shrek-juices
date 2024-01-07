import "dotenv/config";
import { readFile } from "fs/promises";
import JuiceModel from "../models/juices.model.js";
import { connectDatabase } from "../utils/dbConnections.js";

async function main() {
  // Read the data from json files
  const fruitsData = await readFile("src/data/fruit-juices.json", "utf-8");
  const vegetablesData = await readFile(
    "src/data/vegetable-juices.json",
    "utf-8",
  );
  const chocolateJuices = await readFile(
    "src/data/chocolate-juices.json",
    "utf-8",
  );
  const smoothies = await readFile("src/data/smoothies.json", "utf-8");
  const proteinShakes = await readFile("src/data/protien-shakes.json", "utf-8");
  const winterMenu = await readFile("src/data/winter-menu.json", "utf-8");
  const mocktails = await readFile("src/data/mocktails.json", "utf-8");

  // Connect to database
  await connectDatabase(process.env.DB_URL);

  // Add data in mongodb
  await JuiceModel.insertMany(JSON.parse(fruitsData));
  await JuiceModel.insertMany(JSON.parse(vegetablesData));
  await JuiceModel.insertMany(JSON.parse(chocolateJuices));
  await JuiceModel.insertMany(JSON.parse(smoothies));
  await JuiceModel.insertMany(JSON.parse(proteinShakes));
  await JuiceModel.insertMany(JSON.parse(winterMenu));
  await JuiceModel.insertMany(JSON.parse(mocktails));
  console.log("Populated database");
  process.exit(0);
}

main();
