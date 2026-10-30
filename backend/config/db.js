const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_inventory');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Optional fallback message for local dev
    console.log('💡 Tip: Make sure MongoDB is running locally or provide a valid MONGODB_URI in backend/.env');
  }
};

module.exports = connectDB;
