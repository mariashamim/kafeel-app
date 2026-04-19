import mongoose from 'mongoose';

// Use standard connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://kafeel_user:Kafeel123456@cluster0.3tnjcc6.mongodb.net:27017/kafeel_db?ssl=true&authSource=admin';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      family: 4, // Use IPv4, skip IPv6
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      cached.promise = null;
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}