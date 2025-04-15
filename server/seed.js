console.log('MongoDB URI:', process.env.MONGODB_URI);
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Book = require('./models/Book'); // adjust if your model path is different

console.log('MongoDB URI:', process.env.MONGODB_URI); // just to confirm

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const dataPath = path.join(__dirname, 'books.json');
    const booksData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Optional: Clear existing books
    await Book.deleteMany();
    console.log('🗑️ Cleared existing books');

    await Book.insertMany(booksData);
    console.log(`📚 Seeded ${booksData.length} books!`);

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    mongoose.disconnect();
  }
}

seedBooks();
