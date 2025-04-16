const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`; // 👈 use dynamic base URL

app.use(cors());
app.use(express.json());

// API health check route
app.get('/api', (req, res) => {
  res.send('Bookshop API is running 🎉');
});

// Create a new book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);

    // Ensure coverImage uses relative path
    if (newBook.coverImage && !newBook.coverImage.startsWith('/uploads/')) {
      newBook.coverImage = `/uploads/${newBook.coverImage}`;
    }

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();

    const updatedBooks = books.map(book => {
      const bookObj = book.toObject();
      if (bookObj.coverImage && !bookObj.coverImage.startsWith('http')) {
        // Ensure it starts with /uploads/
        if (!bookObj.coverImage.startsWith('/uploads/')) {
          bookObj.coverImage = `/uploads/${bookObj.coverImage}`;
        }
        bookObj.coverImage = `${BASE_URL}${bookObj.coverImage}`;
      }   
      return bookObj;
    });

    res.json(updatedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const bookObj = book.toObject();
    if (bookObj.coverImage && !bookObj.coverImage.startsWith('http')) {
      if (!bookObj.coverImage.startsWith('/uploads/')) {
        bookObj.coverImage = `/uploads/${bookObj.coverImage}`;
      }
      bookObj.coverImage = `${BASE_URL}${bookObj.coverImage}`;
    } 
    res.json(bookObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload API route
const uploadRoutes = require('./routes/upload');
app.use('/api', uploadRoutes);

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });