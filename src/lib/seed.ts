import User from "@/models/User";
import Property from "@/models/Property";
import Product from "@/models/Product";
import Review from "@/models/Review";

let isSeeded = false;

function generate100Properties() {
  const locations = [
    "GT Road", "Junction Road", "Subhash Road", "Aligarh Road", "Mandi Road",
    "Industrial Area", "Shubham Vihar", "Anand Vihar", "Green Park Enclave",
    "Tariyan Colony", "Pahasu Road", "Bulandshahr Road", "Navalpur", "Dharpa Bypass",
    "Pottery Market Road", "Railway Station Road"
  ];

  const images = [
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  ];

  const sellerNames = [
    "Ramesh Sharma", "Shubham Gupta", "Devender Singh", "Chaudhary Dharamvir",
    "Sanjay Pottery Works", "Sunil Kumar", "Vikas Agarwal", "Rajeshwar Prasad",
    "Satish Chand", "Deepak Industrial Corp", "Mohit Jain", "Dr. Alok Sharma",
    "Manish Verma", "Amit Tyagi", "Praveen Yadav", "Rakesh Singhal"
  ];

  const types: Array<"residential" | "commercial" | "plot" | "agricultural"> = [
    "residential", "commercial", "plot", "agricultural"
  ];
  
  const listingTypes: Array<"sell" | "rent" | "lease"> = ["sell", "rent", "lease"];

  const properties = [];

  for (let i = 1; i <= 100; i++) {
    const type = types[(i - 1) % types.length];
    const listingType = listingTypes[(i - 1) % listingTypes.length];
    const loc = locations[(i - 1) % locations.length];
    const seller = sellerNames[(i - 1) % sellerNames.length];
    const img = images[(i - 1) % images.length];

    let title = "";
    let price = 0;
    let area = 0;
    let areaUnit: "sqft" | "sqyd" | "acre" | "bigha" = "sqft";
    let desc = "";
    let features: string[] = [];

    if (type === "residential") {
      if (listingType === "sell") {
        title = `${(i % 3) + 2} BHK Independent Villa for Sale in ${loc}`;
        price = 2500000 + (i * 45000);
        area = 1200 + (i * 15);
        areaUnit = "sqft";
        desc = `Spacious ${(i % 3) + 2} BHK residential villa with modern fittings, ventilated rooms, modular kitchen, and parking in prime ${loc}, Khurja.`;
        features = ["Parking Space", "Modular Kitchen", "Balcony", "Gated Security"];
      } else {
        title = `Furnished ${(i % 2) + 2} BHK Floor for Rent in ${loc}`;
        price = 7000 + (i * 250);
        area = 900 + (i * 10);
        areaUnit = "sqft";
        desc = `Well-maintained ${(i % 2) + 2} BHK house for rent in ${loc}, Khurja with 24hr water supply, power backup, and wide colony roads.`;
        features = ["24/7 Water", "Balcony", "Separate Meter", "Car Parking"];
      }
    } else if (type === "commercial") {
      if (listingType === "sell") {
        title = `Prime Commercial Shop Space for Sale on ${loc}`;
        price = 3500000 + (i * 60000);
        area = 450 + (i * 20);
        areaUnit = "sqft";
        desc = `High footfall main road commercial property on ${loc}, Khurja. Ideal for retail stores, banking, pharmacy, or brand showrooms.`;
        features = ["Main Road Facing", "High Footfall", "Power Backup", "Glass Front"];
      } else {
        title = `Commercial Hall / Office Space for ${listingType === "lease" ? "Lease" : "Rent"} on ${loc}`;
        price = 15000 + (i * 500);
        area = 1200 + (i * 30);
        areaUnit = "sqft";
        desc = `Spacious commercial hall for ${listingType === "lease" ? "lease" : "rent"} in ${loc}, Khurja. Perfect for coaching centers, offices, or warehouse storage.`;
        features = ["Open Floor", "Washroom", "Separate Entry", "CCTV Installed"];
      }
    } else if (type === "plot") {
      title = `${100 + (i * 5)} Gaj Residential Plot for Sale in ${loc}`;
      price = 1200000 + (i * 35000);
      area = 900 + (i * 45);
      areaUnit = "sqft";
      desc = `Corner plot available in fast-developing colony in ${loc}, Khurja. Wide RCC road, electricity connection ready, streetlights installed.`;
      features = ["Corner Plot", "25ft Wide Road", "Boundary Wall", "Clear Title"];
    } else {
      title = `${(i % 5) + 2} Bigha Fertile Agricultural Land for Sale near ${loc}`;
      price = 4500000 + (i * 80000);
      area = 25000 + (i * 500);
      areaUnit = "bigha";
      desc = `Highly fertile agricultural land near ${loc}, Khurja with tube-well irrigation system, canal access, and tractor connectivity.`;
      features = ["Canal Water Access", "Tube-well Pump", "Tractor Road Access", "Freehold Land"];
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;

    properties.push({
      title,
      slug,
      description: desc,
      type,
      listingType,
      status: "active",
      price,
      area,
      areaUnit,
      location: loc,
      address: `Plot / Shop No. ${i * 3}, ${loc}, Khurja, UP`,
      images: [img],
      features,
      contactName: seller,
      contactPhone: "917906896546",
      isFeatured: i <= 15 || i % 6 === 0,
      views: 45 + (i * 3),
    });
  }

  return properties;
}

function generate100Products() {
  const categories = [
    "Bikes & Cars",
    "Electric Vehicles",
    "Mobiles & Laptops",
    "Electronics",
    "Home Appliances",
    "Furniture & Decor",
    "Others",
  ];

  const conditions: Array<"new" | "used" | "refurbished"> = ["used", "new", "refurbished"];

  const locations = [
    "GT Road", "Junction Road", "Subhash Road", "Aligarh Road", "Mandi Road",
    "Industrial Area", "Shubham Vihar", "Anand Vihar", "Green Park Enclave",
    "Tariyan Colony"
  ];

  const sellers = [
    "Sanjay Electronics", "Rakesh Appliance Hub", "Cool Care Khurja", "Gupta Traders",
    "Verma Electronics", "Nitin Sharma", "Computer Care Khurja", "EV Motors Khurja",
    "Captain Vikram", "iCare Mobile Khurja", "Cycle World Khurja", "Royal Furniture House",
    "Decor Studio Khurja", "Refurb Appliance Hub", "Khurja Appliance Store"
  ];

  const imageMap: Record<string, string[]> = {
    "Home Appliances": [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"
    ],
    "Electronics": [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80"
    ],
    "Bikes & Cars": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
    ],
    "Electric Vehicles": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
    ],
    "Mobiles & Laptops": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
    ],
    "Furniture & Decor": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"
    ],
    "Others": [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80"
    ]
  };

  const products = [];

  for (let i = 1; i <= 100; i++) {
    const category = categories[(i - 1) % categories.length];
    const condition = conditions[(i - 1) % conditions.length];
    const loc = locations[(i - 1) % locations.length];
    const seller = sellers[(i - 1) % sellers.length];
    const catImages = imageMap[category] || imageMap["Others"];
    const img = catImages[(i - 1) % catImages.length];

    let title = "";
    let price = 0;
    let desc = "";

    if (category === "Home Appliances") {
      const items = ["LG 260L Refrigerator", "Samsung Washing Machine", "Voltas 1.5 Ton AC", "Symphony 70L Air Cooler", "Whirlpool Microwave", "Havells Water Heater"];
      const item = items[i % items.length];
      title = `${item} (${condition === "new" ? "Brand New" : condition === "refurbished" ? "Refurbished" : "Second-Hand"})`;
      price = 4500 + (i * 350);
      desc = `Well-maintained ${item} in perfect working condition. Includes 100% copper parts, genuine bill, and testing warranty in ${loc}, Khurja.`;
    } else if (category === "Electronics") {
      const items = ["Sony 43 Inch Smart LED TV", "Philips Soundbar System", "Canon DSLR Camera", "Boat Bluetooth Party Speaker", "Mi 32 Inch Android TV"];
      const item = items[i % items.length];
      title = `${item} (${condition === "new" ? "New Box Open" : condition === "refurbished" ? "Certified Refurbished" : "Pre-Owned"})`;
      price = 3200 + (i * 450);
      desc = `High performance ${item} with crystal clear display/sound, remote, wall mount, and original power adapter.`;
    } else if (category === "Bikes & Cars") {
      const items = ["Honda Activa 5G Scooter", "Hero Splendor Plus Bike", "Royal Enfield Bullet 350", "Bajaj Pulsar 150", "TVS Jupiter 110cc"];
      const item = items[i % items.length];
      title = `${item} (${2018 + (i % 6)} Model)`;
      price = 28000 + (i * 1200);
      desc = `Single hand owner ${item} driven in Khurja. All original RC papers, valid insurance, smooth engine, and fresh service done.`;
    } else if (category === "Electric Vehicles") {
      const items = ["Ather 450X Electric Scooter", "Ola S1 Pro EV", "Hero Electric Optima", "Okinawa Dual EV Loader"];
      const item = items[i % items.length];
      title = `${item} (${condition === "new" ? "New Demo Vehicle" : "Used - 85km Range"})`;
      price = 45000 + (i * 1500);
      desc = `Clean ${item} with long battery life, fast portable charger, digital touch dashboard, and zero maintenance cost.`;
    } else if (category === "Mobiles & Laptops") {
      const items = ["HP Pavilion i7 Gaming Laptop", "Apple iPhone 12 (64GB)", "Dell Latitude Business Laptop", "Samsung Galaxy S21 5G", "Lenovo ThinkPad i5"];
      const item = items[i % items.length];
      title = `${item} (${condition === "refurbished" ? "Refurbished with Warranty" : condition === "new" ? "Sealed Pack" : "Used - 88% Battery"})`;
      price = 14500 + (i * 850);
      desc = `High speed ${item} with original charger, fast RAM, excellent battery backup, and scratchless body condition.`;
    } else if (category === "Furniture & Decor") {
      const items = ["L-Shape Fabric Sofa Set (6 Seater)", "Solid Teak Wood King Bed", "Wooden 4-Seater Dining Table", "Steel Almirah Wardrobe", "Executive Office Chair"];
      const item = items[i % items.length];
      title = `${item} (${condition === "new" ? "Brand New Factory Direct" : "Lightly Used"})`;
      price = 5500 + (i * 600);
      desc = `Premium quality ${item} crafted with durable wood/cushions. Perfect for home or office setups in ${loc}, Khurja.`;
    } else {
      const items = ["Firefox 21-Speed Gear Bicycle", "Hero Ranger Mountain Cycle", "Singer Sewing Machine", "Khurja Handcrafted Ceramic Vases Set"];
      const item = items[i % items.length];
      title = `${item} (${condition === "new" ? "Brand New" : "Pre-Owned"})`;
      price = 1800 + (i * 200);
      desc = `Authentic local product / item in great condition available directly from seller in ${loc}, Khurja.`;
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}-p${i}`;

    products.push({
      title,
      slug,
      description: desc,
      category,
      condition,
      status: "active",
      price,
      images: [img],
      location: loc,
      contactName: seller,
      contactPhone: "917906896546",
      isFeatured: i <= 15 || i % 5 === 0,
      views: 30 + (i * 4),
    });
  }

  return products;
}

export async function seedDatabase(force: boolean = false) {
  if (isSeeded && !force) return;

  try {
    // 1. Admin User
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      await User.create({
        name: "Admin Support",
        email: "admin@khurjadeals.com",
        password: "KhurjaDeals@2026",
        role: "admin",
        status: "active",
      });
      console.log("Seeded admin user.");
    }

    // 2. Properties Seeding (100 Properties across all categories and locations)
    const propertyCount = await Property.countDocuments();
    if (propertyCount < 100 || force) {
      if (force || propertyCount < 100) {
        await Property.deleteMany({});
      }
      const mockProperties = generate100Properties();

      await Property.insertMany(mockProperties);
      console.log(`Database Seeded: Created ${mockProperties.length} mock properties.`);
    }

    // 3. Products Seeding (100 Products covering ALL categories and ALL conditions)
    const productCount = await Product.countDocuments();
    if (productCount < 100 || force) {
      if (force || productCount < 100) {
        await Product.deleteMany({});
      }
      const mockProducts = generate100Products();

      await Product.insertMany(mockProducts);
      console.log(`Database Seeded: Created ${mockProducts.length} mock bazaar products.`);
    }

    // 4. Reviews Seeding (5 Property, 5 Product/Vehicle, 4 General)
    const reviewCount = await Review.countDocuments();
    if (reviewCount < 14 || force) {
      if (force) {
        await Review.deleteMany({});
      }
      const mockReviews = [
        // 5 Property Reviews
        {
          name: "Amit Sharma",
          location: "GT Road, Khurja",
          rating: 5,
          category: "property",
          message: "KhurjaDeals helped me find a commercial plot on GT Road directly from the owner without any middleman agent commission. Transaction was smooth and transparent!",
          status: "approved",
        },
        {
          name: "Rajesh Goel",
          location: "Junction Road, Khurja",
          rating: 5,
          category: "property",
          message: "Posted my 3 BHK house for sale and received direct inquiry calls within 24 hours. Sold my house in less than two weeks without paying single rupee commission.",
          status: "approved",
        },
        {
          name: "Priyanka Chaudhry",
          location: "Navalpura, Khurja",
          rating: 4,
          category: "property",
          message: "Great platform for renting out 2 BHK flats in Khurja. Got verified family tenants very quickly. Highly recommended for property owners!",
          status: "approved",
        },
        {
          name: "Manoj Kumar Verma",
          location: "City Station Area",
          rating: 5,
          category: "property",
          message: "Best real estate portal in Khurja. Found an agricultural plot near GT Road at genuine market rates.",
          status: "approved",
        },
        {
          name: "Sunita Rani",
          location: "Subhash Road",
          rating: 5,
          category: "property",
          message: "Direct owner contact feature is very useful. Saved around Rs. 40,000 in brokerage fees while buying our new plot!",
          status: "approved",
        },

        // 5 Product / Vehicle Reviews
        {
          name: "Rahul Solanki",
          location: "GT Road",
          rating: 5,
          category: "product",
          message: "Bought a used Hero Splendor Bike in top condition at just ₹38,000. Seller was local and verified. Smooth deal!",
          status: "approved",
        },
        {
          name: "Vikas Yadav",
          location: "Mandi Road",
          rating: 5,
          category: "product",
          message: "Purchased Ather 450X EV Scooter through KhurjaDeals. Battery health was great and price was very reasonable.",
          status: "approved",
        },
        {
          name: "Deepak Teotia",
          location: "Junction Road",
          rating: 4,
          category: "product",
          message: "Sold my secondhand Maruti Swift Car within 3 days. Got good resale value directly from buyer without local dealer cuts.",
          status: "approved",
        },
        {
          name: "Ankit Gupta",
          location: "City Station Area",
          rating: 5,
          category: "product",
          message: "Got a second-hand LG Double Door Refrigerator for my shop. Working perfectly for last 3 months!",
          status: "approved",
        },
        {
          name: "Neha Agarwal",
          location: "Subhash Road",
          rating: 5,
          category: "product",
          message: "Bought a used Dell i5 Laptop for college work at half the market rate. Very happy with the deal!",
          status: "approved",
        },

        // 4 General Reviews
        {
          name: "Suresh Chand",
          location: "Khurja",
          rating: 5,
          category: "general",
          message: "KhurjaDeals is the most trusted local marketplace app in Khurja. Easy to browse listings and connect directly on WhatsApp!",
          status: "approved",
        },
        {
          name: "Kavita Sharma",
          location: "GT Road, Khurja",
          rating: 5,
          category: "general",
          message: "Clean user interface and 100% verified listings. Admin support team responds quickly on call.",
          status: "approved",
        },
        {
          name: "Dr. R.K. Singh",
          location: "Junction Road",
          rating: 5,
          category: "general",
          message: "Wonderful local initiative for Khurja residents. No fake ads, zero spam, and direct contact details!",
          status: "approved",
        },
        {
          name: "Nitin Kumar",
          location: "Subhash Road",
          rating: 4,
          category: "general",
          message: "Super convenient website for local buy, sell, and rent. Highly useful service for Khurja people!",
          status: "approved",
        },
      ];

      await Review.insertMany(mockReviews);
      console.log(`Database Seeded: Created ${mockReviews.length} mock customer reviews.`);
    }

    isSeeded = true;
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
