import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Shop = ({ cart, setCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortedBooks, setSortedBooks] = useState([]);

  // Fetch books on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        const uniqueBooks = res.data.filter(
          (book, index, self) =>
            index === self.findIndex((b) => b._id === book._id)
        );
        setBooks(uniqueBooks);
        setSortedBooks(uniqueBooks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Add book to cart
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingBook = prevCart.find((item) => item._id === book._id);
      if (existingBook) {
        return prevCart.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  // Filter books by title or author
  const handleFilter = (event) => {
    const keyword = event.target.value.toLowerCase();
    setFilter(keyword);

    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(keyword) ||
        (book.authors &&
          book.authors.some((author) =>
            author.toLowerCase().includes(keyword)
          ))
    );

    setSortedBooks(filteredBooks);
  };

  // Sort books by price
  const sortBooksByPrice = (direction) => {
    const sorted = [...sortedBooks].sort((a, b) =>
      direction === "asc" ? a.price - b.price : b.price - a.price
    );
    setSortedBooks(sorted);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">📚 Bestsellers</h1>

      {/* Search and Sort Controls */}
      <div className="mb-3">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control"
          placeholder="Search by title or author..."
        />
        <div className="mt-3">
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => sortBooksByPrice("asc")}
          >
            Sort by Price: Low to High
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => sortBooksByPrice("desc")}
          >
            Sort by Price: High to Low
          </button>
        </div>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading books...</p>}
      {error && (
        <div className="alert alert-danger">
          Failed to load books. Please try again later.
        </div>
      )}

      {/* Book Grid */}
      <div className="row">
        {sortedBooks.map((book) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={book._id}>
            <Link to={`/book/${book._id}`} className="card h-100 border-0 shadow-sm text-decoration-none">
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="card-img-top p-3"
                  style={{
                    height: "250px",
                    objectFit: "contain",
                  }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h6 className="card-title text-dark">{book.title}</h6>
                <small className="text-muted mb-1">
                  by {book.authors?.join(", ")}
                </small>
                <small className="text-secondary mb-2">{book.format}</small>
                <p className="fw-bold mb-2">
                  NZD ${book.price?.toFixed(2)}
                </p>

                <button
                  className="btn btn-sm btn-primary mt-auto"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
