const { MongoClient } = require('mongodb');

// Simplified connection string - no database name specified
const uri = "mongodb+srv://thefolio_user:TheFolio2026@thefolio-cluster.9n7zzyo.mongodb.net/";

async function test() {
  console.log('🔌 Testing simplified connection...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // List available databases
    const databases = await client.db().admin().listDatabases();
    console.log('📊 Available databases:');
    databases.databases.forEach(db => console.log(`   - ${db.name}`));
    
    await client.close();
    console.log('✅ Test passed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n⚠️ DNS error - your network is blocking SRV lookups.');
      console.log('Try using the standard connection string instead:');
      console.log('mongodb://thefolio_user:TheFolio2026@thefolio-cluster-shard-00-00.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-01.9n7zzyo.mongodb.net:27017,thefolio-cluster-shard-00-02.9n7zzyo.mongodb.net:27017/');
    }
  }
}

test();