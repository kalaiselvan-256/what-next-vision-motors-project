/**
 * ============================================================================
 * WhatNext Vision Motors - Database Connection Configuration
 * ============================================================================
 * @description Manages MongoDB lifecycle with primary connection handling,
 *              event listeners, and automated in-memory fallback.
 * ============================================================================
 */

const mongoose = require('mongoose');

// Connection State Reference
let mongoMemoryServer = null;

// Default Connection Options
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 4000,
  autoIndex: true,
};

/**
 * Connect to primary MongoDB database with automated fallback
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  const connectionURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/whatnext_motors';

  // 1. Setup Connection Lifecycle Event Listeners
  setupConnectionListeners();

  try {
    // 2. Attempt Standard MongoDB Connection
    console.log(`[Database] Connecting to: ${connectionURI}...`);
    const connection = await mongoose.connect(connectionURI, MONGO_OPTIONS);
    console.log(`[Database] ✓ Primary MongoDB Connected: ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`);
    return connection;
  } catch (primaryError) {
    console.warn(`[Database] ⚠️ Primary connection failed: ${primaryError.message}`);
    console.log('[Database] 🔄 Initializing In-Memory MongoDB Fallback Instance...');

    // 3. Fallback: Launch In-Memory Mongo Instance for Zero-Config Setup
    return await initializeMemoryServer();
  }
}

/**
 * Initializes in-memory MongoDB fallback server
 * @private
 */
async function initializeMemoryServer() {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryURI = mongoMemoryServer.getUri();

    const connection = await mongoose.connect(memoryURI, MONGO_OPTIONS);
    console.log(`[Database] ✓ In-Memory MongoDB Online: ${memoryURI}`);
    return connection;
  } catch (memoryError) {
    console.error('[Database] ✕ Critical Database Initialization Failure:', memoryError.message);
    process.exit(1);
  }
}

/**
 * Configures global Mongoose event listeners
 * @private
 */
function setupConnectionListeners() {
  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] ⚠️ MongoDB disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Database] ✕ Connection Error:', err.message);
  });
}

/**
 * Gracefully close database connection and stop memory servers
 */
async function closeDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[Database] Connection closed cleanly.');
    }
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      console.log('[Database] In-memory server stopped.');
    }
  } catch (err) {
    console.error('[Database] Error during disconnect:', err.message);
  }
}

module.exports = {
  connectDB,
  closeDB,
};
