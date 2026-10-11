import User from "@/models/User";

let isSeeded = false;

export async function seedDatabase(force: boolean = false) {
  if (isSeeded && !force) return;

  try {
    // 1. Admin User Seeding (Ensures admin login always exists)
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      await User.create({
        name: "Admin Support",
        email: "admin@khurjadeals.com",
        password: "KhurjaDeals@2026",
        role: "admin",
        status: "active",
      });
      console.log("Seeded default admin user.");
    }

    isSeeded = true;
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
