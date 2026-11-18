const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sehatsaathi';

  try {
    // Attempt standard MongoDB connection with a 4 second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection at '${uri}' failed: ${err.message}`);

    // If local MongoDB isn't running, fallback to MongoMemoryServer
    try {
      console.log('🔄 Initializing embedded MongoDB Memory Server for zero-friction local development/testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'sehatsaathi',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded MongoDB instance running at: ${memoryUri}`);
      
      // Seed initial dummy data if embedded memory server is started
      const { autoSeedInitialData } = require('../utils/seedData');
      await autoSeedInitialData();

      return conn;
    } catch (memErr) {
      console.error('❌ Failed to connect to both local MongoDB and Memory Server:', memErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
