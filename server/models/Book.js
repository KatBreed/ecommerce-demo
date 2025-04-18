import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    authors: [String],
    description: String,
    price: {type: Number},
    publisher: String,
    publishDate: {type: Date},
    isbn: String,
    format: String,
    pages: Number,
    weight: String,
    dimensions: String,
    synopsis: String,
    coverImage: String,
    createdAt: {type: Date, default: Date.now},
});

const Book  = mongoose.model('Book', bookSchema);

export default Book;
