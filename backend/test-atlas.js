const mongoose = require('mongoose');

// Replace this with YOUR actual connection string
const uri = "mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/thefolio?retryWrites=true&w=majority";

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // List databases to confirm
    const databases = await mongoose.connection.db.admin().listDatabases();
    console.log('📊 Available databases:');
    databases.databases.forEach(db => console.log(`   - ${db.name}`));
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();