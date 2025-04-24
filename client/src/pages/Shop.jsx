import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";

const Shop = ({ cart, setCart }) => {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [genre, setGenre] = useState("all");
  const [format, setFormat] = useState("all");
  const [sort, setSort] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        const uniqueBooks = res.data.filter(
          (book, index, self) =>
            index === self.findIndex((b) => b._id === book._id)
        );
        setBooks(uniqueBooks);
        setDisplayBooks(uniqueBooks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading books.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...books];

    if (filter.trim()) {
      const keyword = filter.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(keyword) ||
          (book.authors &&
            book.authors.some((author) =>
              author.toLowerCase().includes(keyword)
            ))
      );
    }

    if (genre !== "all") {
      filtered = filtered.filter((book) => book.genre === genre);
    }

    if (format !== "all") {
      filtered = filtered.filter((book) => book.format === format);
    }

    if (sort === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "titleAsc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "titleDesc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setDisplayBooks(filtered);
  }, [filter, genre, format, sort, books]);

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
    setNotification(`${book.title} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const genres = [...new Set(books.map((book) => book.genre))].filter(Boolean);
  const formats = [...new Set(books.map((book) => book.format))].filter(
    Boolean
  );

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {notification && (
        <div className="alert alert-success position-fixed top-0 end-0 m-4 z-3">
          {notification}
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Shop", path: "/shop" },
        ]}
      />

      <h1 className="mb-4">📚 All Books</h1>

      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="sticky-top" style={{ top: "5rem" }}>
            <div className="mb-4">
              <label className="form-label fw-bold">Search</label>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control border-dark"
                placeholder="Title or Author..."
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Browse By Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="form-select border-dark"
              >
                <option value="all">All Genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="form-select border-dark"
              >
                <option value="all">All Formats</option>
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="form-select border-dark"
              >
                <option value="">Choose...</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="titleAsc">Title: A to Z</option>
                <option value="titleDesc">Title: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="row">
            {displayBooks.map((book) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={book._id}>
                <div className="card h-100 border-1 shadow-sm p-2">
                  <Link
                    to={`/book/${book._id}`}
                    className="text-decoration-none"
                  >
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
                      <small className="text-secondary mb-2">
                        {book.format}
                      </small>
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

            {displayBooks.length === 0 && (
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
