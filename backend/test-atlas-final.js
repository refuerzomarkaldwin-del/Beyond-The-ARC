const mongoose = require('mongoose');

// Your connection string
const uri = "mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/thefolio?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔌 Testing MongoDB Atlas connection...');
  console.log('📡 Using username: markalduen_db_user');
  console.log('🔐 Password: ********');
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Check if we can access the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database has ${collections.length} collections`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n⚠️ DNS error. Try the standard connection string instead:');
      console.log('mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/thefolio?retryWrites=true&w=majority');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n⚠️ Authentication failed. Check:');
      console.log('1. Username is "thefolio_user"');
      console.log('2. Password is "TheFolio2026"');
      console.log('3. No typos or extra spaces');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n⚠️ Network error. Check:');
      console.log('1. Your internet connection');
      console.log('2. IP whitelist in Atlas Network Access');
    }
  }
}

testConnection();