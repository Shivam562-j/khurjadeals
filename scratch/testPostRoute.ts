async function testApi() {
  try {
    const res = await fetch("http://localhost:3000/api/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        phone: "9876543210",
        type: "property-sell",
        location: "Khurja City",
        message: "Looking to sell house in Khurja",
      }),
    });

    console.log("Status Code:", res.status);
    const data = await res.json();
    console.log("Response Body:", data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testApi();
