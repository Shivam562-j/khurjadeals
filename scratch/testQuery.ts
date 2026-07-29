import connectDB from "../src/lib/mongodb";
import Query from "../src/models/Query";

async function test() {
  try {
    await connectDB();
    console.log("DB Connected");
    const q = await Query.create({
      name: "Ramesh",
      phone: "9876543210",
      email: "",
      type: "property",
      message: "Test message",
    });
    console.log("Query created successfully:", q._id);
  } catch (err) {
    console.error("Error creating query:", err);
  }
}

test();
