import User from "@/models/User";
import Property from "@/models/Property";
import Product from "@/models/Product";

let isSeeded = false;

export async function seedDatabase() {
  if (isSeeded) return;

  try {
    // 1. Check/Seed Admin User
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      await User.create({
        name: "Admin Support",
        email: "admin@khurjadeals.com",
        password: "KhurjaDeals@2026", // will be hashed automatically by pre-save hook
        role: "admin",
        status: "active",
      });
      console.log("Database Seeded: Created default admin (admin@khurjadeals.com)");
    }

    // 2. Check/Seed Properties
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      const mockProperties = [
        {
          title: "Premium Commercial Shop on G.T. Road",
          slug: "premium-commercial-shop-on-gt-road",
          description: "A spacious 200 sq. yard commercial shop located in the prime market area of G.T. Road, Khurja. The property has excellent visibility, high foot traffic, and is perfect for retail showrooms, banks, or franchise outlets. Includes water supply and 24/7 power backup.",
          type: "commercial",
          listingType: "sell",
          status: "active",
          price: 4500000,
          area: 1800,
          areaUnit: "sqft",
          location: "GT Road",
          address: "Shop No. 42, GT Road, near Flyover, Khurja, UP",
          images: [
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
          ],
          features: ["Parking Space", "Main Road Face", "Water Storage", "Power Backup"],
          contactName: "Ramesh Sharma",
          contactPhone: "917906896546",
          isFeatured: true,
          views: 120,
        },
        {
          title: "Residential Plot for Sale near Khurja Junction",
          slug: "residential-plot-near-khurja-junction",
          description: "150 Gaj residential plot available for immediate sale in a secure gated colony near Khurja Junction. The colony has wide concrete roads, LED street lights, and green parks. Ideal for building your dream home or for high-yield investment.",
          type: "plot",
          listingType: "sell",
          status: "active",
          price: 1800000,
          area: 1350,
          areaUnit: "sqft",
          location: "Junction Road",
          address: "Plot 89, Shubham Vihar Colony, Junction Road, Khurja",
          images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
          ],
          features: ["Gated Colony", "24ft Wide Road", "Park Facing", "Electricity Connection"],
          contactName: "Shubham Gupta",
          contactPhone: "917906896546",
          isFeatured: true,
          views: 95,
        },
        {
          title: "Spacious 3 BHK Independent House for Rent",
          slug: "spacious-3-bhk-independent-house-for-rent",
          description: "Beautifully constructed double-story 3 BHK independent house for rent in a peaceful residential area of Khurja. The house has modular kitchen, big balcony, marble flooring, and dedicated car parking. Available for families or corporate executives.",
          type: "residential",
          listingType: "rent",
          status: "active",
          price: 12000,
          area: 1600,
          areaUnit: "sqft",
          location: "Subhash Road",
          address: "House 12B, Subhash Road, Khurja",
          images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
          ],
          features: ["Modular Kitchen", "Balcony", "Car Parking", "Water Tank"],
          contactName: "Devender Singh",
          contactPhone: "917906896546",
          isFeatured: false,
          views: 64,
        }
      ];

      await Property.insertMany(mockProperties);
      console.log("Database Seeded: Created mock properties");
    }

    // 3. Check/Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const mockProducts = [
        {
          title: "Traditional Blue Ceramic Flower Pot",
          slug: "traditional-blue-ceramic-flower-pot",
          description: "Beautiful hand-painted blue ceramic flower pot crafted by Khurja artisans. Durable, glaze-finished, and perfect for adding local heritage to your living room or garden space. Stands 12 inches tall.",
          category: "Pottery & Ceramics",
          condition: "new",
          status: "active",
          price: 350,
          images: [
            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
          ],
          location: "Pottery Market",
          contactName: "Khurja Artisans Coop",
          contactPhone: "917906896546",
          isFeatured: true,
          views: 180,
        },
        {
          title: "Set of 6 Glazed Tea/Coffee Mugs",
          slug: "set-of-6-glazed-tea-coffee-mugs",
          description: "High-quality microwave-safe glazed ceramic mugs in dual-tone colors. Sturdy handle design, non-toxic, and crafted in local ceramic units of Khurja.",
          category: "Pottery & Ceramics",
          condition: "new",
          status: "active",
          price: 280,
          images: [
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
          ],
          location: "Pottery Market",
          contactName: "Pottery Hub Sales",
          contactPhone: "917906896546",
          isFeatured: true,
          views: 145,
        },
        {
          title: "Used Hero Ranger Mountain Bicycle",
          slug: "used-hero-ranger-mountain-bicycle",
          description: "Hero Ranger cycle in excellent running condition. 18 speed gear shift, new front tires, and comfortable seat cover. Used for only 1 year. Reason for selling: owner moving to college.",
          category: "Bicycles & Toys",
          condition: "used",
          status: "active",
          price: 3200,
          images: [
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80"
          ],
          location: "GT Road",
          contactName: "Amit Kumar",
          contactPhone: "917906896546",
          isFeatured: false,
          views: 42,
        }
      ];

      await Product.insertMany(mockProducts);
      console.log("Database Seeded: Created mock bazaar products");
    }

    isSeeded = true;
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
