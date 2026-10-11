import User from "@/models/User";

let isSeeded = false;

export async function seedDatabase(force: boolean = false) {
  if (isSeeded && !force) return;

  try {
    const adminEmail = String(process.env.ADMIN_EMAIL).trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD).trim();
    const adminName = String(process.env.ADMIN_NAME).trim();

    // 1. Admin User Seeding (Driven by .env)
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "active",
      });
      console.log(`Seeded default admin user from .env (${adminEmail}).`);
    } else {
      // Ensure admin user specified in .env exists
      const existingUser = await User.findOne({ email: adminEmail });
      if (!existingUser) {
        await User.create({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: "admin",
          status: "active",
        });
        console.log(`Created admin user from .env (${adminEmail}).`);
      }
    }

    isSeeded = true;
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
