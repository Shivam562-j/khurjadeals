const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function run() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.log("No MONGODB_URI found in environment.");
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Import seed function dynamically
    const { seedDatabase } = require("../src/lib/seed");
    await seedDatabase(true);
    console.log("Database force re-seeded successfully!");
  } catch (err) {
    console.error("Reseed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
