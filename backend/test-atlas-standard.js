const mongoose = require('mongoose');

// STANDARD connection string (not SRV)
const uri = "mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/thefolio?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔌 Testing MongoDB Atlas connection...');
  console.log('📡 Using STANDARD connection format (mongodb://)');
  console.log('🔐 Username: thefolio_user');
  console.log('🔐 Password: ********');
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Check if we can access the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database has ${collections.length} collections`);
    
    // Try to insert a test document
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Successfully wrote to database!');
    
    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.log('\n⚠️ Network/Connection error. Check:');
      console.log('1. Your IP is whitelisted in Atlas (0.0.0.0/0)');
      console.log('2. Your internet connection is stable');
      console.log('3. Try adding 0.0.0.0/0 to IP whitelist if not already');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n⚠️ Authentication failed. Check:');
      console.log('1. Username is "thefolio_user"');
      console.log('2. Password is "TheFolio2026"');
      console.log('3. No special characters that need escaping');
    }
  }
}

testConnection();