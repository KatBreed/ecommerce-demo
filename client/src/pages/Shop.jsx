import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Shop = ({ cart, setCart }) => {
  const [books, setBooks] = useState([]);
  const [sortedBooks, setSortedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  // Fetch books
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

  // Add to cart handler
  const addToCart = (book) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === book._id);
      if (exists) {
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
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(keyword) ||
        (book.authors &&
          book.authors.some((author) =>
            author.toLowerCase().includes(keyword)
          ))
    );
    setSortedBooks(filtered);
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
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active">Shop</li>
        </ol>
      </nav>

      <h1 className="mb-4">📚 Bestsellers</h1>

      {/* Main Grid */}
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="sticky-top" style={{ top: "5rem" }}>
            {/* Search */}
            <div className="mb-4">
              <label className="form-label fw-bold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-primary text-primary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  value={filter}
                  onChange={handleFilter}
                  className="form-control border-primary"
                  placeholder="Title or Author..."
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="form-label fw-bold">Sort by Price</label>
              <select
                onChange={(e) => sortBooksByPrice(e.target.value)}
                className="form-select border-primary text-primary"
                defaultValue=""
              >
                <option value="" disabled>Choose...</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="col-lg-9">
          {loading && <p>Loading books...</p>}
          {error && (
            <div className="alert alert-danger">
              Failed to load books. Please try again later.
            </div>
          )}

          <div className="row">
            {sortedBooks.map((book) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={book._id}>
                <div className="card h-100 border-0 shadow-sm text-decoration-none p-2">
                  <Link to={`/book/${book._id}`} className="text-decoration-none">
                    {book.coverImage && (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="card-img-top p-3"
                        style={{ height: "250px", objectFit: "contain" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title text-dark">{book.title}</h6>
                      <small className="text-muted mb-1">
                        by {book.authors?.join(", ")}
                      </small>
                      <small className="text-secondary mb-2">{book.format}</small>
                      <p className="fw-bold text-body mb-2">
                        NZD ${book.price?.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                  <button
                    className="btn btn-sm btn-primary mt-auto"
                    onClick={() => addToCart(book)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}

            {!loading && sortedBooks.length === 0 && (
              <div className="col-12">
                <p>No books found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
