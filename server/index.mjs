import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import mongoose from 'mongoose';
import * as AdminJSMongoose from '@adminjs/mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import Book from './models/Book.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register the adapter
AdminJS.registerAdapter(AdminJSMongoose);

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Stripe setup
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook endpoint (MUST come before express.json)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('💰 PaymentIntent was successful!');
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ PaymentIntent failed.');
      break;
    case 'checkout.session.completed':
      console.log('✅ Checkout session completed!');
      break;
    case 'customer.created':
      console.log('👤 New customer created.');
      break;
    case 'invoice.payment_succeeded':
      console.log('📄 Invoice payment succeeded.');
      break;
    case 'invoice.payment_failed':
      console.log('📄 Invoice payment failed.');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

// Parse JSON for all other routes
app.use(express.json());

// =======================
// 🔐 AdminJS Integration
// =======================
const adminJs = new AdminJS({
  resources: [Book],
  rootPath: '/admin',
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return { email };
    }
    return null;
  },
  cookiePassword: process.env.COOKIE_SECRET || 'some-secure-cookie',
});

app.use(adminJs.options.rootPath, adminRouter);

// =======================
// 🌐 Your Existing Routes
// =======================

// Health check
app.get('/api', (req, res) => {
  res.send('Bookshop API is running 🎉');
});

// Upload route
app.use('/api', uploadRoutes);

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    const updatedBooks = books.map(book => {
      const bookObj = book.toObject();
      if (bookObj.coverImage && !bookObj.coverImage.startsWith('http')) {
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

// Get single book
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

// Create new book + append to JSON
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();

    const { _id, __v, createdAt, ...cleanBook } = newBook.toObject();

    const filePath = path.join(__dirname, 'books.json');
    let booksArray = [];

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        booksArray = JSON.parse(content);
      } catch (err) {
        console.error('Invalid JSON in books.json:', err);
      }
    }

    booksArray.push(cleanBook);
    fs.writeFileSync(filePath, JSON.stringify(booksArray, null, 2));

    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error creating book:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

  const line_items = cartItems.map(item => ({
    price_data: {
      currency: 'nzd',
      product_data: {
        name: item.title,
        images: [item.coverImage],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the session.' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
