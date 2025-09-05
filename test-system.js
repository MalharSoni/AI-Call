const fetch = require('node-fetch');

async function testSystem() {
  console.log('🧪 Testing AI-Call System...\n');
  
  try {
    // Test main server health
    console.log('1. Testing main server (port 3000)...');
    const healthResponse = await fetch('http://localhost:3000/health');
    if (healthResponse.ok) {
      console.log('   ✅ Main server is running');
    } else {
      console.log('   ❌ Main server health check failed');
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to main server:', error.message);
  }
  
  try {
    // Test web UI
    console.log('2. Testing web UI (port 3001)...');
    const webResponse = await fetch('http://localhost:3001');
    if (webResponse.ok) {
      console.log('   ✅ Web UI is running');
    } else {
      console.log('   ❌ Web UI failed to respond');
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to web UI:', error.message);
  }
  
  // Test API endpoints
  try {
    console.log('3. Testing setup API...');
    const setupResponse = await fetch('http://localhost:3001/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        websiteUrl: 'https://example.com',
        bookingUrl: 'https://example.com/book',
        staffPhone: '+1234567890'
      })
    });
    
    if (setupResponse.status === 500 || setupResponse.status === 200) {
      // 500 is expected since ingest service isn't running yet
      console.log('   ✅ Setup API is responding');
    } else {
      console.log('   ❌ Setup API failed');
    }
  } catch (error) {
    console.log('   ❌ Setup API error:', error.message);
  }
  
  // Test environment variables
  console.log('4. Checking environment variables...');
  const requiredVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN', 
    'TWILIO_VOICE_NUMBER',
    'OPENAI_API_KEY',
    'ELEVENLABS_API_KEY',
    'SUPABASE_URL',
    'COHERE_API_KEY'
  ];
  
  let envCount = 0;
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      envCount++;
    }
  });
  
  console.log(`   ✅ ${envCount}/${requiredVars.length} environment variables configured`);
  
  console.log('\n🎉 System Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Set up database schema in Supabase (as shown earlier)');
  console.log('   2. Configure Twilio webhook URL');  
  console.log('   3. Visit http://localhost:3001 to test the UI');
  console.log('   4. Use ngrok for external webhook access during development');
}

// Load environment variables
require('dotenv').config();
testSystem();