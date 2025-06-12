
#!/usr/bin/env node

const axios = require('axios');

async function testIntegration() {
  console.log('🔧 Testing LV Backend, Admin Panel, and LUV VALENCIA Integration...\n');

  const tests = [
    {
      name: 'LV Backend Health Check',
      url: 'http://localhost:5000/api/health',
      expected: { status: 'OK' }
    },
    {
      name: 'Products API (Direct)',
      url: 'http://localhost:5000/api/products',
      expected: { success: true }
    },
    {
      name: 'Products API (Via Proxy)',
      url: 'http://localhost:5173/lv-api/products',
      expected: { success: true }
    },
    {
      name: 'Client Health Check',
      url: 'http://localhost:5173/health',
      expected: { status: 'OK' }
    },
    {
      name: 'Admin Panel API Config',
      url: 'http://localhost:5000/api/health',
      expected: { status: 'OK' },
      description: 'Admin should connect to this endpoint'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.get(test.url, { timeout: 5000 });
      
      if (response.data && typeof test.expected === 'object') {
        const hasExpectedFields = Object.keys(test.expected).every(
          key => response.data[key] !== undefined
        );
        
        if (hasExpectedFields) {
          console.log(`✅ ${test.name} - PASSED`);
          if (test.description) console.log(`   ${test.description}`);
        } else {
          console.log(`❌ ${test.name} - FAILED (Missing expected fields)`);
        }
      } else {
        console.log(`✅ ${test.name} - PASSED (Response received)`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   Service not running on ${test.url}`);
      }
    }
    console.log('');
  }

  console.log('🎯 Integration Test Complete!\n');
  console.log('📋 Connection Summary:');
  console.log('   • LV Backend should run on port 5000');
  console.log('   • Client proxy routes /lv-api/* to LV Backend');
  console.log('   • Admin panel connects directly to LV Backend API');
  console.log('   • All services should be accessible via their respective ports');
}

// Run the test
testIntegration().catch(console.error);
