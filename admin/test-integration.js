// Admin Panel Integration Test
// Tests all admin endpoints to ensure they follow strict UX rules

const BASE_URL = 'http://localhost:5000/api';

async function testAdminEndpoints() {
  console.log('🔐 Testing Admin Panel Integration...\n');

  // 1. Test Admin Login
  console.log('1. Testing Admin Login...');
  try {
    const loginResponse = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginResponse.json();
    
    console.log('Login response:', loginData);
    if (loginData.data && loginData.data.token) {
      console.log('✅ Admin login successful');
      const token = loginData.data.token;
      
      // 2. Test Products API
      console.log('\n2. Testing Products API...');
      const productsResponse = await fetch(`${BASE_URL}/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const productsData = await productsResponse.json();
      
      if (productsData.success && productsData.data.products) {
        console.log(`✅ Products fetched: ${productsData.data.products.length} products`);
        console.log(`✅ Pagination: Page ${productsData.data.page}/${productsData.data.totalPages}`);
      } else {
        console.log('❌ Products API failed');
      }
      
      // 3. Test Analytics API
      console.log('\n3. Testing Analytics API...');
      const analyticsResponse = await fetch(`${BASE_URL}/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success && analyticsData.data) {
        console.log(`✅ Analytics data loaded`);
        console.log(`   Revenue: $${analyticsData.data.totalRevenue}`);
        console.log(`   Orders: ${analyticsData.data.totalOrders}`);
        console.log(`   Products: ${analyticsData.data.totalProducts}`);
      } else {
        console.log('❌ Analytics API failed');
      }
      
      // 4. Test Product Creation
      console.log('\n4. Testing Product Creation...');
      const newProduct = {
        name: 'Test Admin Product',
        price: 99.99,
        category: 'test',
        description: 'Product created via admin API test'
      };
      
      const createResponse = await fetch(`${BASE_URL}/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct)
      });
      const createData = await createResponse.json();
      
      if (createData.success && createData.data) {
        console.log(`✅ Product created: ID ${createData.data.id}`);
        
        // 5. Test Product Update
        console.log('\n5. Testing Product Update...');
        const updateResponse = await fetch(`${BASE_URL}/admin/products/${createData.data.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ price: 149.99 })
        });
        const updateData = await updateResponse.json();
        
        if (updateData.success) {
          console.log('✅ Product updated successfully');
        } else {
          console.log('❌ Product update failed');
        }
        
        // 6. Test Product Deletion
        console.log('\n6. Testing Product Deletion...');
        const deleteResponse = await fetch(`${BASE_URL}/admin/products/${createData.data.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const deleteData = await deleteResponse.json();
        
        if (deleteData.success) {
          console.log('✅ Product deleted successfully');
        } else {
          console.log('❌ Product deletion failed');
        }
      } else {
        console.log('❌ Product creation failed');
      }
      
    } else {
      console.log('❌ Admin login failed');
    }
  } catch (error) {
    console.log('❌ Integration test failed:', error.message);
  }
  
  console.log('\n🎯 Admin Panel Integration Test Complete!');
}

// Run the test
testAdminEndpoints();