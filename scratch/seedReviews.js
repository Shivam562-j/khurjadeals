const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

let MONGODB_URI = "mongodb://localhost:27017/khurjadeals";
try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match && match[1]) {
    MONGODB_URI = match[1].trim();
  }
} catch (e) { }

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: "Khurja" },
    rating: { type: Number, required: true },
    category: { type: String, enum: ["property", "product", "general"], default: "general" },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Review.deleteMany({});
    console.log("Cleared existing reviews.");

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
    console.log(`Successfully seeded ${mockReviews.length} reviews into database!`);
  } catch (err) {
    console.error("Error seeding reviews:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
