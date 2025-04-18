import { useEffect, useState } from 'react';
import axios from 'axios';

const Shop = ({ cart, setCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  // Add to cart handler
  const addToCart = (book) => {
    setCart(prevCart => {
      const existingBook = prevCart.find(item => item._id === book._id);
      if (existingBook) {
        return prevCart.map(item =>
          item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };  

  return (
    <div className="container py-5">
      <h1 className="mb-4">📚 Bestsellers</h1>

      {loading && <p>Loading books...</p>}
      {error && (
        <div className="alert alert-danger">
          Failed to load books. Please try again later.
        </div>
      )}

      <div className="row">
        {books.map(book => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={book._id}>
            <div className="card h-100 shadow-sm" style={{ maxWidth: '340px', minHeight: '240px' }}>
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="card-img-top img-fluid"
                  style={{ maxHeight: '180px', objectFit: 'contain' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5
                  className="card-title fw-bold"
                  style={{
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {book.title}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.8rem' }}>
                  by {book.authors?.join(', ')}
                </h6>
                <h6 className="card-subtitle mb-2 fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>
                  {book.format}
                </h6>
                <p className="card-text text-success fw-bold" style={{ fontSize: '0.85rem' }}>
                  NZD ${book.price?.toFixed(2)}
                </p>
                <button
                  className="btn btn-sm btn-primary mt-auto"
                  onClick={() => addToCart(book)}
                  aria-label={`Add ${book.title} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Cart Preview */}
      {/* 
      {cart.length > 0 && (
        <div className="mt-5">
          <h2>🛒 Cart ({cart.length} items)</h2>
          <ul className="list-group">
            {cart.map((item, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {item.title} (x{item.quantity})
                <span className="text-success">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mt-3">
            <h5>Total:</h5>
            <h5 className="text-success">${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h5>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default Shop;
