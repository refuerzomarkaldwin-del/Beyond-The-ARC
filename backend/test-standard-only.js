const { MongoClient } = require('mongodb');

// STANDARD connection string (no SRV)
const uri = "mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/?retryWrites=true&w=majority";

async function test() {
  console.log('🔌 Testing STANDARD connection string...');
  console.log('📡 Format: mongodb:// (not srv)');
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout
      connectTimeoutMS: 15000,
    });
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test write permission
    const db = client.db('thefolio');
    const testColl = db.collection('_test');
    await testColl.insertOne({ test: true, time: new Date() });
    console.log('✅ Successfully wrote to database!');
    
    await client.close();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.log('\n⚠️ Connection timeout. Possible causes:');
      console.log('1. Your IP is not whitelisted in Atlas');
      console.log('2. Your network/firewall is blocking port 27017');
      console.log('3. The Atlas cluster might be paused or unavailable');
      
      console.log('\n🔧 Try these fixes:');
      console.log('1. Verify 0.0.0.0/0 is in Atlas IP whitelist (I see it is ✅)');
      console.log('2. Try disabling Windows Firewall temporarily');
      console.log('3. Try using a VPN (Cloudflare WARP is free)');
    }
  }
}

test();