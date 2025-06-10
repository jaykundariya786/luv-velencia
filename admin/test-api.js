// Simple script to test all admin API endpoints
const API_BASE = "http://127.0.0.1:5000/api";
const TOKEN = "demo-admin-token-123";

async function testAPI(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: Error - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🚀 Testing Admin API Endpoints...\n");

  // Auth endpoints
  console.log("--- AUTH ENDPOINTS ---");
  await testAPI("/admin/login", "POST", {
    username: "admin",
    password: "admin123",
  });
  await testAPI("/admin/verify");
  await testAPI("/admin/logout", "POST");

  // Users endpoints
  console.log("\n--- USERS ENDPOINTS ---");
  await testAPI("/admin/users");
  await testAPI("/admin/users/1");
  await testAPI("/admin/users/1", "PUT", { name: "Updated Name" });
  await testAPI("/admin/users/1/toggle-status", "PATCH");
  await testAPI("/admin/users/1/status", "PUT", { isActive: true });

  // Products endpoints
  console.log("\n--- PRODUCTS ENDPOINTS ---");
  await testAPI("/admin/products");
  await testAPI("/admin/products/1");
  await testAPI("/admin/products/categories");
  await testAPI("/admin/products", "POST", {
    name: "Test Product",
    price: 100,
  });
  await testAPI("/admin/products/1", "PUT", { name: "Updated Product" });
  await testAPI("/admin/products/1", "DELETE");

  // Orders endpoints
  console.log("\n--- ORDERS ENDPOINTS ---");
  await testAPI("/admin/orders");
  await testAPI("/admin/orders/ORD-001");
  await testAPI("/admin/orders/ORD-001/status", "PUT", {
    status: "shipped",
    trackingNumber: "TRK123",
  });
  await testAPI("/admin/orders/ORD-001/bill");

  // Analytics endpoints
  console.log("\n--- ANALYTICS ENDPOINTS ---");
  await testAPI("/admin/analytics");

  console.log("\n✨ API Testing Complete!");
}

// Run tests if this file is executed directly
if (typeof window === "undefined") {
  runTests();
}
